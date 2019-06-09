import { IncomingMessage, ServerResponse } from 'http';

/**
 * Exception content.
 *
 * @property {IncomingMessage} request Request instance.
 * @property {ServerResponse} response Response instance.
 */
interface ExceptionContent {
  request: IncomingMessage;
  response: ServerResponse;
}

/**
 * Base HTTPException class.
 *
 * @property {number} code HTTP status code.
 * @property {string | undefined} message Message to show.
 * @property {T} content Content.
 */
export class HTTPException<T = ExceptionContent> {
  constructor(public code: number, public message?: string, public content?: T) { }
}

/** HTTP 400 Exception: Bad Request. */
export class HTTP400Exception extends HTTPException {
  constructor(message: string = 'Bad Request', content?: ExceptionContent) { super(400, message, content); }
}

/** HTTP 401 Exception: Unauthorized. */
export class HTTP401Exception extends HTTPException {
  constructor(message: string = 'Unauthorized', content?: ExceptionContent) { super(401, message, content); }
}

/** HTTP 403 Exception: Forbidden. */
export class HTTP403Exception extends HTTPException {
  constructor(message: string = 'Forbidden', content?: ExceptionContent) { super(403, message, content); }
}

/** HTTP 404 Exception: Not Found. */
export class HTTP404Exception extends HTTPException {
  constructor(message: string = 'Not Found', content?: ExceptionContent) { super(404, message, content); }
}

/** HTTP 500 Exception: Internal Server Error. */
export class HTTP500Exception extends HTTPException {
  constructor(message: string = 'Internal Server Error', content?: ExceptionContent) { super(500, message, content); }
}
