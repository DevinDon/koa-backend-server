import { HTTP400Exception } from '../exceptions';

export const requiredParamsInFields = <T>(params: T, fields: (keyof T)[]): void => {

  const missingParams: (keyof T)[] = fields
    .map(field => params[field] === undefined || params[field] === null ? field : undefined as any)
    .filter(missing => missing !== undefined);

  if (missingParams.length > 0) {
    throw new HTTP400Exception(`Parameters '${missingParams.join(', ')}' are required.`);
  }

};

export const requiredParams = <T>(params: T): void => {

  const fields = Object.keys(params) as (keyof T)[];

  requiredParamsInFields(params, fields);

};

export const requiredAtLeastOneParam = <T>(params: T): void => {

  const fields = Object.keys(params) as (keyof T)[];

  const isAllUndefined = fields
    .map(field => params[field] === undefined || params[field] === null ? 0 : 1 as number)
    .reduce((prev, next) => prev + next) === 0;

  if (isAllUndefined) {
    throw new HTTP400Exception(`At least one of these parameters '${fields.join(', ')}' should be defined.`);
  }

};

export const requiredAtMostOneParam = <T>(params: T): void => {

  const fields = Object.keys(params) as (keyof T)[];

  const isMoreDefined = fields
    .map(field => params[field] === undefined || params[field] === null ? 0 : 1 as number)
    .reduce((prev, next) => prev + next) > 1;

  if (isMoreDefined) {
    throw new HTTP400Exception(`At most one of these parameters '${fields.join(', ')}' should be defined.`);
  }

};

export const requiredInRange = ({ min, value, max }: { min: number, value: number, max: number }): void => {

  const isNotInRange = value < min || value > max;

  if (isNotInRange) {
    throw new HTTP400Exception(`The value ${value} is not in range [${min}, ${max}].`);
  }

};
