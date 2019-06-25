/**
 * Base response interface.
 */
export interface BaseResponse<T = any> {
  status: boolean;
  message?: string;
  content?: T;
}

/**
 * Base request interface.
 */
export interface BaseRequest {
  [index: string]: any;
}
