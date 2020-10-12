import { MetadataKey } from '../@type';

/**
 * Param injection type.
 */
export enum ParamInjectionType {
  PathQuery = 'PARAM$PATH$QUERY',
  PathVariable = 'PARAM$PATH$VARIABLE',
  RequestBody = 'PARAM$REQUEST$BODY',
  RequestHeader = 'PARAM$REQUEST$HEADER',
  HTTPRequest = 'PARAM$HTTP$REQUEST',
  HTTPResponse = 'PARAM$HTTP$RESPONSE',
  HandlerZone = 'PARAM$HANDLER$ZONE'
}

/**
 * Param injection.
 */
export interface ParamInjection {
  type: ParamInjectionType;
  value: string;
}

/**
 * Generate a parameter decorator.
 *
 * @param {ParamInjectionType} type ParamInjectionType, as:
 * - PathQuery
 * - PathVariable
 * - RequestBody
 * - RequestHeader
 * - HTTPRequest
 * - HTTPResponse
 * - HTTPZone
 */
export function baseParam(type: ParamInjectionType | any) {
  return (value: string = ''): ParameterDecorator => (target: any, name, index) => {
    // get existing params array
    const exist: ParamInjection[] = Reflect.getMetadata(MetadataKey.Parameter, target, name) || [];
    // put this param with special index
    exist[index] = { type, value };
    // and then, set it
    Reflect.defineMetadata(MetadataKey.Parameter, exist, target, name);
  };
}

/**
 * Parameter decorator.
 *
 * Inject query object.
 *
 * @param {string} value Key of query object.
 */
export const PathQuery = baseParam(ParamInjectionType.PathQuery);

/**
 * Parameter decorator.
 *
 * Inject path variable.
 *
 * @param {string} value Variable name.
 */
export const PathVariable = baseParam(ParamInjectionType.PathVariable);

/**
 * Parameter decorator.
 *
 * Inject request body object.
 *
 * @param {string} value It will use the type of value if it is defined. Else, use content-type.
 */
export const RequestBody = baseParam(ParamInjectionType.RequestBody);

/**
 * Parameter decorator.
 *
 * Inject special request header.
 *
 * @param {string} value Name of header.
 */
export const RequestHeader = baseParam(ParamInjectionType.RequestHeader);

/**
 * Parameter decorator.
 *
 * Inject response instance.
 */
export const HTTPRequest = baseParam(ParamInjectionType.HTTPRequest);

/**
 * Parameter decorator.
 *
 * Inject response instance.
 */
export const HTTPResponse = baseParam(ParamInjectionType.HTTPResponse);

/**
 * Parameter decorator.
 *
 * Inject handler zone.
 */
export const HandlerZone = baseParam(ParamInjectionType.HandlerZone);
