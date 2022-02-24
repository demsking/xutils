import { Response } from 'express';
import { ITrace } from '../typings';
import { HttpError } from './HttpError';

export type InternalError = Error & {
  [key: string]: any;
};

export default {
  handleError(err: InternalError, res: Response, logger?: ITrace): void {
    if (err instanceof HttpError) {
      res.status(err.statusCode);

      if (err.body) {
        res.json(err.body);
        logger?.error(`${err.statusCode} - Body: ${JSON.stringify(err.body)}`);
      } else {
        res.end();
        logger?.error(`${err.statusCode} - ${err.message}`);
      }
    } else if (err.statusCode) {
      res.status(err.statusCode).json({
        error: err.message,
      });

      logger?.error(`${err.statusCode} - ${err.message}`);
    } else if (err.status) {
      res.status(err.status).json({
        error: err.message,
      });

      logger?.error(`${err.status} - ${err.message}`);
    } else {
      res.status(500).json({
        error: err.message,
      });

      logger?.error(`500 - ${err.message} - ${err.stack}`);
    }
  },
};
