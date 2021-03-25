import { HTTP404Exception } from '../exceptions';
import { ResterResponse, ResponseConfig } from './rester.response';

export type ExistResponseConfig = Partial<ResponseConfig> & {
  message?: string;
};

export class ExistResponse extends ResterResponse {

  constructor({ data, message = 'Resource not found.', ...rest }: ExistResponseConfig) {
    if (!data) {
      throw new HTTP404Exception(message);
    }
    super({ data, ...rest });
  }

}
