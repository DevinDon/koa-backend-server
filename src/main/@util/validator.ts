import { HTTP400Exception } from '../exception';

export function requiredParams<T = any>(params: T, fields: string[]): any {
  for (const field of fields) {
    if (params[field] === undefined || params[field] === null) {
      throw new HTTP400Exception(`params '${fields.join(', ')}' are required`);
    }
  }
}

export function numberInRange(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
