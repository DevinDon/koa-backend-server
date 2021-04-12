import { HTTP400Exception } from '../exceptions';

export const requiredParam = <T = any>(param: T): void => {
  if (param === undefined || param === null) {
    throw new HTTP400Exception('Parameters are required.');
  }
};

export const requiredParams = <T extends Array<any>>(...params: T): void => {
  for (const param of params) {
    if (param === undefined || param === null) {
      throw new HTTP400Exception('Parameters are required.');
    }
  }
};

export const requiredParamsInFields = <T>(params: T, fields?: (keyof T)[]): void => {
  if (fields === undefined) {
    fields = Object.keys(params) as (keyof T)[];
  }
  for (const field of fields) {
    if (params[field] === undefined || params[field] === null) {
      throw new HTTP400Exception(`Parameters '${fields.join(', ')}' are required.`);
    }
  }
};

export const requiredAtLeastOneParam = <T extends Array<any>>(...params: T) => {

  const isAllUndefined = params
    .map(param => param === undefined ? 1 : 0 as number)
    .reduce((prev, curr) => prev + curr) === params.length;

  if (isAllUndefined) {
    throw new HTTP400Exception('There should be at least one parameter that is not undefined.');
  }

};

export const requiredAtMostOneParam = <T extends Array<any>>(...params: T) => {

  const isMoreDefined = params
    .map(param => param === undefined ? 0 : 1 as number)
    .reduce((prev, curr) => prev + curr) > 1;

  if (isMoreDefined) {
    throw new HTTP400Exception('There should be at most one parameter that is defined.');
  }

};

export const numberInRange = (min: number, value: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
