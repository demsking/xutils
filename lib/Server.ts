import { IServer, global } from '../..';
import type { Express, Request, Response, RequestHandler, Application, Router } from 'express';
import type { Server as NodeServer } from 'http';
import type { AppConfigModel } from '../models/AppConfigModel';

import fs from 'fs';
import YAML from 'yaml';
import http from 'http';
import https from 'https';
import express from 'express';
import logger from 'morgan';

import cli from './cli';
import env from './env';
import Ping from './Ping';
import MiddlewareUtils from './MiddlewareUtils';

import { Trace } from './Trace';
import { cleanEnv, str } from 'envalid';
import { createValidator } from './validator';
import { AppConfigSchema } from '../schema/AppConfigSchema';

export const createApp = express;

export type { Express, Request, Response, RequestHandler, Application, Router };

interface ActionOptions {
  appConfig: string;
  serverConfig: string;
}

export default class Server<TServerConfig extends IServer.Config> implements IServer.Definition<TServerConfig> {
  readonly options: IServer.Options<TServerConfig>;
  readonly appConfig!: AppConfigModel;
  readonly serverConfig!: TServerConfig;
  server!: NodeServer;
  serviceAccount!: IServer.ServiceAccount;

  static readonly parse = {
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

  constructor(options: IServer.Options<TServerConfig>) {
    const { appConfig: appConfigFilename, serverConfig: serverConfigFilename }: ActionOptions = cli(process.argv.slice(2))
      .version(options.version)
      .usage('Usage: $0 -a [file] -s [file]')
      .alias('a', 'app-config')
      .describe('a', 'Application config YAML file')
      .alias('s', 'server-config')
      .describe('s', 'Server config YAML file')
      .demandOption(['a', 's'])
      .argv as any;

    options.name = options.name.split('/').reverse()[0];
    global.trace = new Trace(options.name);

    const appConfigFile = fs.readFileSync(appConfigFilename, 'utf8');
    const appConfig: AppConfigModel = YAML.parse(appConfigFile);

    const ajv = createValidator();
    const appConfigValidator = ajv.compile(AppConfigSchema);

    if (!appConfigValidator(appConfig)) {
      global.trace.error(`Invalid application config file ${appConfigFilename}`);
      global.trace.error(JSON.stringify(appConfigValidator.errors, null, 2));
      process.exit(1);
    }

    const serverConfigValidator = ajv.compile(options.schema);
    const serverConfigFile = fs.readFileSync(serverConfigFilename, 'utf8');
    const serverConfig: TServerConfig = YAML.parse(serverConfigFile);

    if (!serverConfigValidator(serverConfig)) {
      global.trace.error(`Invalid server config file ${serverConfigFilename}. Errors:`);
      global.trace.error(JSON.stringify(serverConfigValidator.errors, null, 2));
      process.exit(2);
    }

    this.options = options;
    this.appConfig = appConfig;
    this.serverConfig = serverConfig;
  }

  getServiceAccount(): IServer.ServiceAccount {
    if (!this.serviceAccount) {
      const env = cleanEnv(process.env, {
        NANE_SERVER_ACCOUNT: str({ desc: 'Service account file' }),
      });

      this.serviceAccount = require(env.NANE_SERVER_ACCOUNT);
    }

    return this.serviceAccount;
  }

  protected async _start(): Promise<void> {
    const app = express();
    const loggerFormat = env.isProduction
      ? `:date[iso] ${this.options.name} HTTP - :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
      : `:date[iso] ${this.options.name} HTTP - :method :url :status :response-time ms - :res[content-length]`;

    global.trace.info(`Setting ${this.options.name} server...`);
    app.disable('x-powered-by');

    app.use(logger(loggerFormat));

    app.route('/status')
      .head((req, res) => res.sendStatus(200))
      .get((req, res) => res.json({
        name: this.options.name,
        version: this.options.version,
        status: 'up',
        uptime: process.uptime(),
      }));

    app.set('port', this.options.port);

    await this._prepare();

    if (this.options.beforeStart) {
      try {
        await this.options.beforeStart(this);
      } catch (err: any) {
        global.trace.error('Failed to initialize server');

        if (err.message) {
          global.trace.error(err.message);
        }

        global.trace.error(`${err.stack}`);

        process.exit(6);
      }
    }

    this.options.loader(app, this);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: () => void) => MiddlewareUtils.handleError(err, res));

    this.server = this.options.certificat
      ? https.createServer(this.options.certificat, app)
      : http.createServer(app);

    this.server.on('error', (error: any) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          global.trace.error(`${this.options.port} requires elevated privileges`);
          process.exit(3);

        case 'EADDRINUSE':
          global.trace.error(`${this.options.port} is already in use`);
          process.exit(4);

        default:
          throw error;
      }
    });

    this.server.on('listening', () => global.trace.info(`Listening on ${this.options.port}`));
    global.trace.info(`Starting ${this.options.name} server...`);
    this.server.listen(this.options.port, '0.0.0.0');
  }

  protected async _prepare(): Promise<void> {}

  async start(): Promise<void> {
    process.on('SIGINT', () => this.server.close(() => process.exit(0)));

    if (this.options.serviceDependencies instanceof Array) {
      try {
        await Ping.checkAll(this.options.serviceDependencies, {
          timeout: 5000,
          interval: env.isProduction ? 10000 : 3000,
          retries: env.isProduction ? 10 : Number.MAX_SAFE_INTEGER,
        });
      } catch (err: any) {
        global.trace.error(err.message);
        global.trace.error('Starting aborted');

        process.exit(5);
      }
    }

    await this._start();
  }
}
