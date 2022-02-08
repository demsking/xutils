export class HttpError extends Error {
  statusCode: number;
  body: any;

  constructor(status: number, body: any = null) {
    super();

    this.statusCode = status;
    this.body = body;
  }

  clone(message: string): HttpError {
    return new HttpError(this.statusCode, message);
  }
}

export const HttpErrors = {
  /**
   * Standard HTTP codes
   */
  NotFound: new HttpError(404, 'Not Found'),
  BadRequest: new HttpError(400, 'Bad Request'),
  Unauthorized: new HttpError(401, 'Unauthorized'),
  Forbidden: new HttpError(403, 'Forbidden'),
  Conflict: new HttpError(409, 'Conflict'),
  PreconditionFailed: new HttpError(412, 'Precondition Failed'),

  /**
   * Custom HTTP codes
   */
  UnauthorizedSigninDisabled: new HttpError(481, 'Local signin is disabled'),
  UnauthorizedSignonDisabled: new HttpError(482, 'Local signon is disabled'),
};
