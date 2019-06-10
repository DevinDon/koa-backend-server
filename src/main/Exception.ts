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
export class HTTPException<T = any> {
  constructor(public code: number, public message?: string, public content?: T) { }
}

/** HTTP 400 Exception: Bad Request. */
export class HTTP400Exception<T> extends HTTPException<T> {
  constructor(message: string = 'Bad Request', content?: T) { super(400, message, content); }
}

/** HTTP 401 Exception: Unauthorized. */
export class HTTP401Exception<T> extends HTTPException<T> {
  constructor(message: string = 'Unauthorized', content?: T) { super(401, message, content); }
}

/** HTTP 403 Exception: Forbidden. */
export class HTTP403Exception<T> extends HTTPException<T> {
  constructor(message: string = 'Forbidden', content?: T) { super(403, message, content); }
}

/** HTTP 404 Exception: Not Found. */
export class HTTP404Exception<T> extends HTTPException<T> {
  constructor(message: string = 'Not Found', content?: T) { super(404, message, content); }
}

/** HTTP 500 Exception: Internal Server Error. */
export class HTTP500Exception<T> extends HTTPException<T> {
  constructor(message: string = 'Internal Server Error', content?: T) { super(500, message, content); }
}
