import { HTTP404Exception } from '../exceptions';
import { BaseResponse, ResponseConfig } from './base.response';

export type ExistResponseConfig = Partial<ResponseConfig> & {
  message?: string;
};

export class ExistResponse extends BaseResponse {

  constructor({ data, message = 'Resource not found.', ...rest }: ExistResponseConfig) {
    if (!data) {
      throw new HTTP404Exception(message);
    }
    super({ data, ...rest });
  }

}
