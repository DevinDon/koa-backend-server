interface Headers {
  [index: string]: number | string | string[];
}

export interface Response<T = any> {

  /** Response status code, default to 200. */
  statusCode?: number;

  /** Response message, default to OK. */
  statusMessage?: string;

  /** Response headers. */
  headers?: Headers;

  /** Response data. */
  data: T;

}

/**
 * Rester base response.
 */
export class BaseResponse<T = any> implements Response<T> {

  /** Response status code, default to 200. */
  statusCode: number = 200;

  /** Response message, default to OK. */
  statusMessage: string = 'OK';

  /** Response headers. */
  headers: Headers = {};

  /** Response data. */
  data: T;

  constructor({ statusCode, statusMessage, headers, data }: Response) {
    this.statusCode = statusCode ?? this.statusCode;
    this.statusMessage = statusMessage ?? this.statusMessage;
    this.headers = headers ?? this.headers;
    this.data = data;
  }

}
