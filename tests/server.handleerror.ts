import { Response } from 'express';
import { HttpError } from '../src/HttpError';
import { Server } from '../src/Server';
import { Trace } from '../src/Trace/trace.node';

jest.mock('../src/Trace');

const trace = new Trace('@platform/core');

const res = {
  sendStatus: jest.fn(),
  status: jest.fn(),
  json: jest.fn(),
  end: jest.fn(),
};

describe('Server', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Server.handleError(err: InternalError, res: Response): void', () => {
    describe('When err instanceof HttpError', () => {
      it('res.status should be equal to err.statusCode when err.body is undefined', () => {
        const httpError: HttpError = new HttpError(404);

        Server.handleError(httpError, res as unknown as Response, trace);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(httpError.statusCode);
        expect(res.end).toHaveBeenCalledTimes(0);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledTimes(0);
      });

      it('res.status should be equal to err.statusCode when err.body is defined', () => {
        const httpError: HttpError = new HttpError(404, { message: 'Fatal error' });

        Server.handleError(httpError, res as unknown as Response, trace);

        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.end).toHaveBeenCalledTimes(0);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.sendStatus).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(httpError.statusCode);
      });
    });
  });

  describe('When err is not instanceof HttpError', () => {
    const err: any = {
      statusCode: 405,
      stack: 'stack test',
      message: 'message test',
    };

    it('res.status should be equal to err.statusCode when err.statusCode is defined', () => {
      Server.handleError(err, res as unknown as Response, trace);

      expect(res.end).toHaveBeenCalledTimes(0);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(err.statusCode);
    });

    it('res.status should be equal to err.statusCode when err.status is defined', () => {
      Server.handleError(err, res as unknown as Response, trace);

      expect(res.end).toHaveBeenCalledTimes(0);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(err.statusCode);
      expect(trace.error).toHaveBeenCalledTimes(1);
      expect(trace.error).toHaveBeenCalledWith('405 - message test');
    });

    it('res.status should be equal to 500 when err.status and err.statusCode are not defined', () => {
      const err: any = {
        stack: 'stack test',
        message: 'message test',
      };

      Server.handleError(err, res as unknown as Response, trace);

      expect(res.end).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(trace.error).toHaveBeenCalledTimes(1);
      expect(trace.error).toHaveBeenCalledWith('500 - message test - stack test');
    });
  });
});
