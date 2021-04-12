import { HTTP404Exception } from '../exceptions';
import { ResterResponse, ResponseConfig } from './rester.response';

export type ExistResponseConfig<T> = Partial<ResponseConfig<T>> & {
  message?: string;
  fields?: (keyof Exclude<T, undefined | null>)[];
};

export class ExistResponse<T> extends ResterResponse<T> {

  constructor({ data, message = 'Resource not found.', fields, ...rest }: ExistResponseConfig<T>) {
    if (data === undefined || data == null) {
      throw new HTTP404Exception(message);
    }
    if (fields) {
      data = fields
        .map(field => ({ [field]: data![field] }))
        .reduce((prev, next) => Object.assign({}, prev, next)) as any;
    }
    super({ data, ...rest });
  }

}
