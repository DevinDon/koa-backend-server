import { HTTP400Exception } from '../exception';

export function requiredParams<T = any>(params: T): any {
  for (const key in params) {
    if (params[key] === undefined || params[key] === null) {
      throw new HTTP400Exception(`parameters '${Object.keys(params).join(', ')}' are required`);
    }
  }
}

export function numberInRange(min: number, value: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
