import { IncomingMessage, ServerResponse } from 'http';

interface ExceptionContent {
  request: IncomingMessage;
  response: ServerResponse;
}

export class HTTPException<T = any> {
  constructor(public code: number, public message?: string, public content?: T) { }
}

export class HTTP400Exception extends HTTPException {
  constructor(message: string = 'Bad Request', content?: ExceptionContent) { super(400, message, content); }
}

export class HTTP401Exception extends HTTPException {
  constructor(message: string = 'Unauthorized', content?: ExceptionContent) { super(401, message, content); }
}

export class HTTP403Exception extends HTTPException {
  constructor(message: string = 'Forbidden', content?: ExceptionContent) { super(403, message, content); }
}

export class HTTP404Exception extends HTTPException {
  constructor(message: string = 'Not Found', content?: ExceptionContent) { super(404, message, content); }
}

export class HTTP500Exception extends HTTPException {
  constructor(message: string = 'Internal Server Error', content?: ExceptionContent) { super(500, message, content); }
}
