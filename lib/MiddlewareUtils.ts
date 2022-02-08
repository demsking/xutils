import { Response } from 'express';
import { HttpError } from './HttpError';
import { global } from '../..';

export type InternalError = Error & {
  [key: string]: any;
};

export default {
  handleError(err: InternalError, res: Response): void {
    if (err instanceof HttpError) {
      res.status(err.statusCode);

      if (err.body) {
        res.json(err.body);
        global.trace.error(`${err.statusCode} - Body: ${JSON.stringify(err.body)}`);
      } else {
        res.end();
        global.trace.error(`${err.statusCode} - ${err.message}`);
      }
    } else if (err.statusCode) {
      res.sendStatus(err.statusCode);
      global.trace.error(`${err.statusCode} - ${err.message}`);
    } else if (err.status) {
      res.sendStatus(err.status);
      global.trace.error(`${err.status} - ${err.message}`);
    } else {
      res.sendStatus(500);
      global.trace.error(`500 - ${err.message} - ${err.stack}`);
    }
  },
};
