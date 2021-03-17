import { HTTP400Exception } from '../exceptions';

export const requiredParam = <T = any>(param: T): void => {
  if (param === undefined || param === null) {
    throw new HTTP400Exception('parameter are required');
  }
};

export const requiredParams = <TArray extends []>(params: TArray): void => {
  for (const param of params) {
    if (params === undefined || params === null) {
      throw new HTTP400Exception('parameters are required');
    }
  }
};

export const requiredParamsInFields = <TObject extends {}>(params: TObject, fields: (keyof TObject)[]): void => {
  for (const field of fields) {
    if (params[field] === undefined || params[field] === null) {
      throw new HTTP400Exception(`params '${fields.join(', ')}' are required`);
    }
  }
};

export const numberInRange = (min: number, value: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
