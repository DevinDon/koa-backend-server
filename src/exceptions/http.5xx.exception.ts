import { HTTPException } from './http.exception';

/** HTTP 500 Exception: Internal Server Error. */
export class HTTP500Exception<T> extends HTTPException<T> {
  constructor(
    message: string = 'Internal Server Error',
    content?: T,
  ) {
    super(500, message, content);
  }
}
