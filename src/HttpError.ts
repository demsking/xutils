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
  // 2xx success

  /**
   * Standard response for successful HTTP requests. The actual response will
   * depend on the request method used. In a GET request, the response will
   * contain an entity corresponding to the requested resource. In a POST
   * request, the response will contain an entity describing or containing the
   * result of the action.
   */
  OK: new HttpError(200, 'OK'),
  /**
   * The request has been fulfilled, resulting in the creation of a new
   * resource.
   */
  Created: new HttpError(201, 'Created'),
  /**
   * The request has been accepted for processing, but the processing has not
   * been completed. The request might or might not be eventually acted upon,
   * and may be disallowed when processing occurs.
   */
  Accepted: new HttpError(202, 'Accepted'),
  /**
   * The server is a transforming proxy (e.g. a Web accelerator) that received
   * a 200 OK from its origin, but is returning a modified version of the
   * origin's response.
   */
  NonAuthoritativeInformation: new HttpError(203, 'Non-Authoritative Information'),
  /**
   * The server successfully processed the request, and is not returning any
   * content.
   */
  NoContent: new HttpError(204, 'No Content'),
  /**
   * The server successfully processed the request, asks that the requester
   * reset its document view, and is not returning any content.
   */
  ResetContent: new HttpError(205, 'Reset Content'),
  /**
   * The server is delivering only part of the resource (byte serving) due to
   * a range header sent by the client. The range header is used by HTTP
   * clients to enable resuming of interrupted downloads, or split a download
   * into multiple simultaneous streams.
   */
  PartialContent: new HttpError(206, 'Partial Content'),
  /**
   * The message body that follows is by default an XML message and can contain
   * a number of separate response codes, depending on how many sub-requests
   * were made.
   */
  MultiStatus: new HttpError(207, 'Multi-Status'),
  /**
   * The members of a DAV binding have already been enumerated in a preceding
   * part of the (multistatus) response, and are not being included again
   */
  AlreadyReported: new HttpError(208, 'Already Reported'),
  /**
   * The server has fulfilled a request for the resource, and the response is
   * a representation of the result of one or more instance-manipulations
   * applied to the current instance.
   */
  IMUsed: new HttpError(226, 'IM Used'),

  // 3xx redirection

  /**
   * Indicates multiple options for the resource from which the client may
   * choose (via agent-driven content negotiation). For example, this code
   * could be used to present multiple video format options, to list files with
   * different filename extensions, or to suggest word-sense disambiguation.
   */
  MultipleChoices: new HttpError(300, 'Multiple Choices'),
  /**
   * This and all future requests should be directed to the given URI.
   */
  MovedPermanently: new HttpError(301, 'Moved Permanently'),
  /**
   * Tells the client to look at (browse to) another URL. The HTTP/1.0
   * specification (RFC 1945) required the client to perform a temporary
   * redirect with the same method (the original describing phrase was "Moved
   * Temporarily"), but popular browsers implemented 302 redirects by changing
   * the method to GET. Therefore, HTTP/1.1 added status codes 303 and 307 to
   * distinguish between the two behaviours.
   */
  Found: new HttpError(302, 'Found'),
  /**
   * The response to the request can be found under another URI using the GET
   * method. When received in response to a POST (or PUT/DELETE), the client
   * should presume that the server has received the data and should issue a
   * new GET request to the given URI.
   */
  SeeOther: new HttpError(303, 'See Other'),
  /**
   * Indicates that the resource has not been modified since the version specified
   * by the request headers If-Modified-Since or If-None-Match. In such case,
   * there is no need to retransmit the resource since the client still has a
   * previously-downloaded copy.
   */
  NotModified: new HttpError(304, 'Not Modified'),
  /**
   * The requested resource is available only through a proxy, the address for
   * which is provided in the response. For security reasons, many HTTP clients
   * (such as Mozilla Firefox and Internet Explorer) do not obey this status
   * code.
   */
  UseProxy: new HttpError(305, 'Use Proxy'),
  /**
   * No longer used. Originally meant "Subsequent requests should use the
   * specified proxy."
   */
  SwitchProxy: new HttpError(306, 'Switch Proxy'),
  /**
   * In this case, the request should be repeated with another URI;
   * however, future requests should still use the original URI.
   * In contrast to how 302 was historically implemented, the request method is
   * not allowed to be changed when reissuing the original request. For example,
   * a POST request should be repeated using another POST request.
   */
  TemporaryRedirect: new HttpError(307, 'Temporary Redirect'),
  /**
   * This and all future requests should be directed to the given URI.
   * 308 parallel the behaviour of 301, but does not allow the HTTP method to
   * change. So, for example, submitting a form to a permanently redirected
   * resource may continue smoothly.
   */
  PermanentRedirect: new HttpError(308, 'Permanent Redirect'),

  // 4xx client errors

  /**
   * The server cannot or will not process the request due to an apparent
   * client error (e.g., malformed request syntax, size too large, invalid
   * request message framing, or deceptive request routing).
   */
  BadRequest: new HttpError(400, 'Bad Request'),
  /**
   * Similar to 403 Forbidden, but specifically for use when authentication
   * is required and has failed or has not yet been provided. The response
   * must include a WWW-Authenticate header field containing a challenge
   * applicable to the requested resource. See Basic access authentication and
   * Digest access authentication. 401 semantically means "unauthorised", the
   * user does not have valid authentication credentials for the target
   * resource.
   */
  Unauthorized: new HttpError(401, 'Unauthorized'),
  /**
   * Reserved for future use. The original intention was that this code might
   * be used as part of some form of digital cash or micropayment scheme, as
   * proposed, for example, by GNU Taler, but that has not yet happened, and
   * this code is not widely used. Google Developers API uses this status if
   * a particular developer has exceeded the daily limit on requests. Sipgate
   * uses this code if an account does not have sufficient funds to start a
   * call. Shopify uses this code when the store has not paid their fees and
   * is temporarily disabled. Stripe uses this code for failed payments where
   * parameters were correct, for example blocked fraudulent payments.
   */
  PaymentRequired: new HttpError(402, 'Payment Required'),
  /**
   * The request contained valid data and was understood by the server, but the
   * server is refusing action. This may be due to the user not having the
   * necessary permissions for a resource or needing an account of some sort,
   * or attempting a prohibited action (e.g. creating a duplicate record where
   * only one is allowed). This code is also typically used if the request
   * provided authentication by answering the WWW-Authenticate header field
   * challenge, but the server did not accept that authentication. The request
   * should not be repeated.
   */
  Forbidden: new HttpError(403, 'Forbidden'),
  /**
   * The requested resource could not be found but may be available in the
   * future. Subsequent requests by the client are permissible.
   */
  NotFound: new HttpError(404, 'Not Found'),
  /**
   * A request method is not supported for the requested resource; for
   * example, a GET request on a form that requires data to be presented via
   * POST, or a PUT request on a read-only resource.
   */
  MethodNotAllowed: new HttpError(405, 'Method Not Allowed'),
  /**
   * The requested resource is capable of generating only content not
   * acceptable according to the Accept headers sent in the request.
   */
  NotAcceptable: new HttpError(406, 'Not Acceptable'),
  /**
   * The client must first authenticate itself with the proxy.
   */
  ProxyAuthenticationRequired: new HttpError(407, 'Proxy Authentication Required'),
  /**
   * The server timed out waiting for the request. According to HTTP
   * specifications: "The client did not produce a request within the time that
   * the server was prepared to wait. The client MAY repeat the request without
   * modifications at any later time."
   */
  RequestTimeout: new HttpError(408, 'Request Timeout'),
  /**
   * Indicates that the request could not be processed because of conflict in
   * the current state of the resource, such as an edit conflict between
   * multiple simultaneous updates.
   */
  Conflict: new HttpError(409, 'Conflict'),
  /**
   * Indicates that the resource requested is no longer available and will not
   * be available again. This should be used when a resource has been
   * intentionally removed and the resource should be purged. Upon receiving a
   * 410 status code, the client should not request the resource in the future.
   * Clients such as search engines should remove the resource from their
   * indices. Most use cases do not require clients and search engines to purge
   * the resource, and a "404 Not Found" may be used instead.
   */
  Gone: new HttpError(410, 'Gone'),
  /**
   * The request did not specify the length of its content, which is required
   * by the requested resource.
   */
  LengthRequired: new HttpError(411, 'Length Required'),
  /**
   * The server does not meet one of the preconditions that the requester put
   * on the request header fields.
   */
  PreconditionFailed: new HttpError(412, 'Precondition Failed'),
  /**
   * The request is larger than the server is willing or able to process.
   */
  PayloadTooLarge: new HttpError(413, 'Payload Too Large'),
  /**
   * The URI provided was too long for the server to process. Often the result
   * of too much data being encoded as a query-string of a GET request, in
   * which case it should be converted to a POST request.
   */
  URITooLong: new HttpError(414, 'URI Too Long'),
  /**
   * The request entity has a media type which the server or resource does not
   * support. For example, the client uploads an image as image/svg+xml, but
   * the server requires that images use a different format.
   */
  UnsupportedMediaType: new HttpError(415, 'Unsupported Media Type'),
  /**
   * The client has asked for a portion of the file (byte serving), but the
   * server cannot supply that portion. For example, if the client asked for
   * a part of the file that lies beyond the end of the file.
   */
  RangeNotSatisfiable: new HttpError(416, 'Range Not Satisfiable'),
  /**
   * The server cannot meet the requirements of the Expect request-header
   * field.
   */
  ExpectationFailed: new HttpError(417, 'Expectation Failed'),
  /**
   * This code was defined in 1998 as one of the traditional IETF April Fools'
   * jokes, in RFC 2324, Hyper Text Coffee Pot Control Protocol, and is not
   * expected to be implemented by actual HTTP servers. The RFC specifies this
   * code should be returned by teapots requested to brew coffee. This HTTP
   * status is used as an Easter egg in some websites, such as Google.com's
   * I'm a teapot easter egg.
   */
  ImATeapot: new HttpError(418, 'I\'m a teapot'),
  /**
   * The request was directed at a server that is not able to produce a
   * response (for example because of connection reuse).
   */
  MisdirectedRequest: new HttpError(421, 'Misdirected Request'),
  /**
   * The request was well-formed but was unable to be followed due to semantic
   * errors.
   */
  UnprocessableEntity: new HttpError(422, 'Unprocessable Entity'),
  /**
   * The resource that is being accessed is locked.
   */
  Locked: new HttpError(423, 'Locked'),
  /**
   * The request failed because it depended on another request and that request
   * failed (e.g., a PROPPATCH).
   */
  FailedDependency: new HttpError(424, 'Failed Dependency'),
  /**
   * Indicates that the server is unwilling to risk processing a request that
   * might be replayed.
   */
  TooEarly: new HttpError(425, 'Too Early'),
  /**
   * The client should switch to a different protocol such as TLS/1.3, given in
   * the Upgrade header field.
   */
  UpgradeRequired: new HttpError(426, 'Upgrade Required'),
  /**
   * The origin server requires the request to be conditional. Intended to
   * prevent the 'lost update' problem, where a client GETs a resource's state,
   * modifies it, and PUTs it back to the server, when meanwhile a third party
   * has modified the state on the server, leading to a conflict.
   */
  PreconditionRequired: new HttpError(428, 'Precondition Required'),
  /**
   * The user has sent too many requests in a given amount of time. Intended
   * for use with rate-limiting schemes.
   */
  TooManyRequests: new HttpError(429, 'Too Many Requests'),
  /**
   * The server is unwilling to process the request because either an
   * individual header field, or all the header fields collectively, are too
   * large.
   */
  RequestHeaderFieldsTooLarge: new HttpError(431, 'Request Header Fields Too Large'),
  /**
   * A server operator has received a legal demand to deny access to a
   * resource or to a set of resources that includes the requested resource.
   * The code 451 was chosen as a reference to the novel Fahrenheit 451
   */
  UnavailableForLegalReasons: new HttpError(451, 'Unavailable For Legal Reasons'),

  // 5xx server errors

  /**
   * A generic error message, given when an unexpected condition was
   * encountered and no more specific message is suitable.
   */
  InternalServerError: new HttpError(500, 'Internal Server Error'),
  /**
   * The server either does not recognize the request method, or it lacks the
   * ability to fulfil the request. Usually this implies future availability
   * (e.g., a new feature of a web-service API).
   */
  NotImplemented: new HttpError(501, 'Not Implemented'),
  /**
   * The server was acting as a gateway or proxy and received an invalid
   * response from the upstream server.
   */
  BadGateway: new HttpError(502, 'Bad Gateway'),
  /**
   * The server cannot handle the request (because it is overloaded or down
   * for maintenance). Generally, this is a temporary state.
   */
  ServiceUnavailable: new HttpError(503, 'Service Unavailable'),
  /**
   * The server was acting as a gateway or proxy and did not receive a timely
   * response from the upstream server.
   */
  GatewayTimeout: new HttpError(504, 'Gateway Timeout'),
  /**
   * The server does not support the HTTP protocol version used in the request.
   */
  HTTPVersionNotSupported: new HttpError(505, 'HTTP Version Not Supported'),
  /**
   * Transparent content negotiation for the request results in a circular
   * reference.
   */
  VariantAlsoNegotiates: new HttpError(506, 'Variant Also Negotiates'),
  /**
   * The server is unable to store the representation needed to complete the
   * request.
   */
  InsufficientStorage: new HttpError(507, 'Insufficient Storage'),
  /**
   * The server detected an infinite loop while processing the request
   * (sent instead of 208 Already Reported).
   */
  LoopDetected: new HttpError(508, 'Loop Detected'),
  /**
   * Further extensions to the request are required for the server to fulfil it
   */
  NotExtended: new HttpError(510, 'Not Extended'),
  /**
   * The client needs to authenticate to gain network access. Intended for use
   * by intercepting proxies used to control access to the network (e.g.,
   * "captive portals" used to require agreement to Terms of Service before
   * granting full Internet access via a Wi-Fi hotspot).
   */
  NetworkAuthenticationRequired: new HttpError(511, 'Network Authentication Required'),
};
