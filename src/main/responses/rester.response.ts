import { HTTPException } from '../exceptions';

interface Headers {
  [index: string]: number | string | string[];
}

export interface ResponseConfig<T = any> {

  /** Response status code, default to 200. */
  statusCode?: number;

  /** Response message, default to OK. */
  statusMessage?: string;

  /** Response headers. */
  headers?: Headers;

  /** Response data. */
  data?: T;

}

/**
 * Rester base http response.
 */
export class ResterResponse<T = any> implements ResponseConfig<T> {

  /** Response status code, default to 200. */
  statusCode: number = 200;

  /** Response message, default to OK. */
  statusMessage: string = 'OK';

  /** Response headers. */
  headers: Headers = {};

  /** Response data. */
  data: T;

  constructor({ statusCode, statusMessage, headers, data }: ResponseConfig) {
    if (statusCode && statusCode >= 400) {
      throw new HTTPException(statusCode, statusMessage, data);
    }
    statusCode && (this.statusCode = statusCode);
    statusMessage && (this.statusMessage = statusMessage);
    headers && (this.headers = headers);
    this.data = data;
  }

}
