import type { IServer } from '..';
import type { Express, Request, Response, RequestHandler, Application, Router } from 'express';
import type { Server as NodeServer } from 'http';

import { ping } from './ping';
import { Trace } from './Trace';

import http from 'http';
import https from 'https';
import express from 'express';
import logger from 'morgan';

import { ITrace } from '../typings';
import { HttpError } from './HttpError';
import { all } from './promise';

export const createApp = express;

export type { Express, Request, Response, RequestHandler, Application, Router, IServer };

export * from './HttpError';

const isProduction = process.env.NODE_ENV === 'production';

export type InternalError = Error & {
  [key: string]: any;
};

export class Server implements IServer.Definition {
  readonly options: IServer.Options;
  server!: NodeServer;
  protected trace: Trace;
  readonly app: Express;

  static readonly parser = {
    /**
     * Parse incoming requests with JSON payloads and is based on body-parser
     */
    json: express.json,
    /**
     * Parse incoming requests with Buffer payloads and is based on body-parser
     */
    raw: express.raw,
    /**
     * Parse incoming requests with text payloads and is based on body-parser
     */
    text: express.text,
    /**
     * Parse incoming requests with urlencoded payloads and is based on body-parser
     */
    urlencoded: express.urlencoded,
  };

  static createRouter(): Router {
    return express.Router({
      strict: true,
      caseSensitive: false,
    });
  }

  static handleError(err: InternalError, res: Response, logger?: ITrace): void {
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

  constructor(options: IServer.Options) {
    options.name = options.name.split('/').reverse()[0];

    this.options = options;
    this.trace = new Trace(options.name);
    this.app = createApp();

    this.trace.info(`Setting ${this.options.name} server...`);
    this.app.disable('x-powered-by');

    const loggerFormat = options.loggerFormat
      ? options.loggerFormat
      : isProduction
        ? `:date[iso] ${options.name} HTTP - :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
        : `:date[iso] ${options.name} HTTP - :method :url :status :response-time ms - :res[content-length]`;


    this.app.use(logger(loggerFormat));
  }

  protected async _start(): Promise<void> {
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

    if (this.options.beforeStart) {
      try {
        await this.options.beforeStart(this);
      } catch (err: any) {
        this.trace.error('Failed to initialize server');

        if (err.message) {
          this.trace.error(err.message);
        }

        this.trace.error(`${err.stack}`);

        process.exit(-6);
      }
    }

    this.options.loader(this.app);

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
  }

  protected async _prepare(): Promise<void> {}

  async start(): Promise<void> {
    process.on('SIGINT', () => this.server.close(() => process.exit(0)));

    if (this.options.serviceDependencies instanceof Array) {
      try {
        await all(this.options.serviceDependencies, (dependency) => ping(dependency, {
          timeout: 5000,
          interval: isProduction ? 5000 : 3000,
          retries: isProduction ? 10 : Number.MAX_SAFE_INTEGER,
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
