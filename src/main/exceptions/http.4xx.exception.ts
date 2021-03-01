import { HTTPException } from './http.exception';

/** HTTP 400 Exception: Bad Request. */
export class HTTP400Exception<T> extends HTTPException<T> {
  constructor(
    message: string = 'Bad Request',
    content?: T,
  ) {
    super(400, message, content);
  }
}

/** HTTP 401 Exception: Unauthorized. */
export class HTTP401Exception<T> extends HTTPException<T> {
  constructor(
    message: string = 'Unauthorized',
    content?: T,
  ) {
    super(401, message, content);
  }
}

/** HTTP 403 Exception: Forbidden. */
export class HTTP403Exception<T> extends HTTPException<T> {
  constructor(
    message: string = 'Forbidden',
    content?: T,
  ) {
    super(403, message, content);
  }
}

/** HTTP 404 Exception: Not Found. */
export class HTTP404Exception<T> extends HTTPException<T> {
  constructor(
    message: string = 'Not Found',
    content?: T,
  ) {
    super(404, message, content);
  }
}
