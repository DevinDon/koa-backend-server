import { HTTP400Exception } from '../exceptions';

export const requiredParams = <T = any>(params: T): any => {
  for (const key in params) {
    if (params[key] === undefined || params[key] === null) {
      throw new HTTP400Exception(`parameters '${Object.keys(params).join(', ')}' are required`);
    }
  }
};

export const requiredParamsInFields = <T = any>(params: T, fields: (keyof T)[]): any => {
  for (const field of fields) {
    if (params[field] === undefined || params[field] === null) {
      throw new HTTP400Exception(`params '${fields.join(', ')}' are required`);
    }
  }
};

export const numberInRange = (min: number, value: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
