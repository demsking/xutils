import type { Server as NodeServer } from 'node:http';
import type { SecureContextOptions } from 'node:tls';
import type { Express, Request, Response, RequestHandler, Application, Router } from 'express';
import type { Trace } from './trace/trace.node.js';

import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { json, raw, text, urlencoded } from 'body-parser';

import express from 'express';
import createLoggerMiddleware from 'morgan';

import { ping } from './ping.js';
import { HttpError } from './http.js';
import { all } from './promise.js';

export type { Express, Request, Response, RequestHandler, Application, Router };

/**
 * Represents an internal error with additional properties.
 */
export type InternalError = Error & {
  [key: string]: any;
};

/**
 * Represents options for server initialization.
 */
export type Options = {
  name: string;
  version: string;
  port: number;
  certificat?: SecureContextOptions;
  serviceDependencies?: string[];
  devMode?: boolean;
  logger?: Trace;
};

/**
 * Creates an Express application instance.
 */
export const createApp = express;

/**
 * Represents a server.
 */
export class Server {
  options: Options;
  server!: NodeServer;
  app: Express;

  /**
   * A collection of request body parsers.
   */
  static readonly parser = {
    /**
     * Parse incoming requests with JSON payloads and is based on body-parser
     */
    json,
    /**
     * Parse incoming requests with Buffer payloads and is based on body-parser
     */
    raw,
    /**
     * Parse incoming requests with text payloads and is based on body-parser
     */
    text,
    /**
     * Parse incoming requests with urlencoded payloads and is based on body-parser
     */
    urlencoded,
  };

  /**
   * Creates an Express router instance.
   * @returns {Router} The Express router.
   */
  static createRouter(): Router {
    return express.Router({
      strict: true,
      caseSensitive: false,
    });
  }

  /**
   * Handles errors and sends appropriate responses.
   * @param {InternalError} err - The error to handle.
   * @param {Response} res - The Express response object.
   * @param {Trace} [logger] - Optional logger instance.
   */
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

  /**
   * Constructs a new Server instance.
   * @param {Options} options - The options for server initialization.
   */
  constructor(options: Options) {
    this.options = options;
    this.app = createApp();

    this.app.disable('x-powered-by');

    if (options.logger) {
      const loggerFormat = options.devMode
        ? `:date[iso] ${options.name} HTTP - :method :url :status :response-time ms - :res[content-length]`
        : `:date[iso] ${options.name} HTTP - :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`;

      this.app.use(createLoggerMiddleware(loggerFormat));
    }
  }

  protected async _start(): Promise<void> {
    this.options.logger?.info(`Setting ${this.options.name} server...`);

    this.app.disable('x-powered-by');
    this.app.route('/status')
      .head((_req, res) => res.sendStatus(200))
      .get((_req, res) => res.json({
        name: this.options.name,
        version: this.options.version,
        status: 'up',
        uptime: process.uptime(),
      }));

    this.app.set('port', this.options.port);

    await this._prepare();

    this.app.use((err: Error, _req: Request, res: Response, _next: () => void) => {
      Server.handleError(err, res, this.options.logger);
    });

    this.server = this.options.certificat
      ? createHttpsServer(this.options.certificat, this.app)
      : createHttpServer(this.app);

    this.server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          this.options.logger?.error(`${this.options.port} requires elevated privileges`);
          process.exit(-3);

        case 'EADDRINUSE':
          this.options.logger?.error(`${this.options.port} is already in use`);
          process.exit(-4);

        default:
          throw error;
      }
    });

    this.server.on('listening', () => this.options.logger?.info(`Listening on ${this.options.port}`));
    this.options.logger?.info(`Starting ${this.options.name} server...`);
    this.server.listen(this.options.port, '0.0.0.0');

    process.on('SIGINT', () => this.server.close(() => process.exit(0)));
  }

  protected async _prepare(): Promise<void> {}

  /**
   * Starts the server.
   * @returns {Promise<void>} A promise that resolves when the server has started.
   */
  async start(): Promise<void> {
    if (this.options.serviceDependencies instanceof Array) {
      try {
        await all(this.options.serviceDependencies, (dependency) => ping(dependency, {
          timeout: 5000,
          interval: this.options.devMode ? 3000 : 5000,
          retries: this.options.devMode ? Number.MAX_SAFE_INTEGER : 10,
          logger: this.options.logger,
        }));
      } catch (err: any) {
        this.options.logger?.error(err.message);
        this.options.logger?.error('Starting aborted');

        process.exit(-5);
      }
    }

    await this._start();
  }
}
