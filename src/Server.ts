import type { InternalError, Options, Server as Interface } from './server';
import type { Express, Request, Response, Router } from 'express';
import type { Server as NodeServer } from 'http';

import http from 'http';
import https from 'https';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

import { ping } from './ping.js';
import { Trace } from './trace/trace.node.js';
import { HttpError } from './http.js';
import { all } from './promise.js';

export const createApp = express;

export class Server implements Interface {
  options: Options;
  server!: NodeServer;
  trace: Trace;
  app: Express;

  static readonly parser = {
    json: bodyParser.json,
    raw: bodyParser.raw,
    text: bodyParser.text,
    urlencoded: bodyParser.urlencoded,
  };

  static createRouter(): Router {
    return express.Router({
      strict: true,
      caseSensitive: false,
    });
  }

  static handleError(err: InternalError, res: Response, logger?: Trace): void {
    if (err instanceof HttpError) {
      res.status(err.statusCode);

      if (err.body) {
        res.json({ error: err.message, body: err.body });
        logger?.error(`${err.statusCode} - ${err.message} - Body: ${JSON.stringify(err.body)}`);
      } else {
        res.json({ error: err.message });
        logger?.error(`${err.statusCode} - ${err.message}`);
      }
    } else if (err.statusCode) {
      res.status(err.statusCode);
      res.json({ error: err.message });
      logger?.error(`${err.statusCode} - ${err.message}`);
    } else if (err.status) {
      res.status(err.status);
      res.json({ error: err.message });
      logger?.error(`${err.status} - ${err.message}`);
    } else {
      res.status(500);
      res.json({ error: err.message });
      logger?.error(`500 - ${err.message} - ${err.stack}`);
    }
  }

  constructor(options: Options) {
    this.options = options;
    this.trace = new Trace(options.name);
    this.app = createApp();

    this.app.disable('x-powered-by');

    const loggerFormat = options.devMode
      ? `:date[iso] ${options.name} HTTP - :method :url :status :response-time ms - :res[content-length]`
      : `:date[iso] ${options.name} HTTP - :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`;

    this.app.use(logger(loggerFormat));
  }

  protected async _start(): Promise<void> {
    this.trace.info(`Setting ${this.options.name} server...`);

    this.app.disable('x-powered-by');
    this.app.route('/status')
      .head((req, res) => res.sendStatus(200))
      .get((req, res) => res.json({
        name: this.options.name,
        version: this.options.version,
        status: 'up',
        uptime: process.uptime(),
      }));

    this.app.set('port', this.options.port);

    await this._prepare();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((err: Error, req: Request, res: Response, next: () => void) => Server.handleError(err, res, this.trace));

    this.server = this.options.certificat
      ? https.createServer(this.options.certificat, this.app)
      : http.createServer(this.app);

    this.server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          this.trace.error(`${this.options.port} requires elevated privileges`);
          process.exit(-3);

        case 'EADDRINUSE':
          this.trace.error(`${this.options.port} is already in use`);
          process.exit(-4);

        default:
          throw error;
      }
    });

    this.server.on('listening', () => this.trace.info(`Listening on ${this.options.port}`));
    this.trace.info(`Starting ${this.options.name} server...`);
    this.server.listen(this.options.port, '0.0.0.0');

    process.on('SIGINT', () => this.server.close(() => process.exit(0)));
  }

  protected async _prepare(): Promise<void> {}

  async start(): Promise<void> {
    if (this.options.serviceDependencies instanceof Array) {
      try {
        await all(this.options.serviceDependencies, (dependency) => ping(dependency, {
          timeout: 5000,
          interval: this.options.devMode ? 3000 : 5000,
          retries: this.options.devMode ? Number.MAX_SAFE_INTEGER : 10,
          logger: this.trace,
        }));
      } catch (err: any) {
        this.trace.error(err.message);
        this.trace.error('Starting aborted');

        process.exit(-5);
      }
    }

    await this._start();
  }
}
