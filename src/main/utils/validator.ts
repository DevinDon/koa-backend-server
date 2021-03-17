import { HTTP400Exception } from '../exceptions';

export const requiredParam = <T = any>(param: T): void => {
  if (param === undefined || param === null) {
    throw new HTTP400Exception('parameters are required');
  }
};

export const requiredParams = <T extends Array<any>>(...params: T): void => {
  for (const param of params) {
    if (params === undefined || params === null) {
      throw new HTTP400Exception('parameters are required');
    }
  }
};

export const requiredParamsInFields = <T>(params: T, fields?: (keyof T)[]): void => {
  if (fields === undefined) {
    fields = Object.keys(params) as (keyof T)[];
  }
  for (const field of fields) {
    if (params[field] === undefined || params[field] === null) {
      throw new HTTP400Exception(`params '${fields.join(', ')}' are required`);
    }
  }
};

export const numberInRange = (min: number, value: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
