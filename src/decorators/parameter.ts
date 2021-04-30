import { MetadataKey } from '../constants';
import { Metadata } from './metadata';

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
  HandlerZone = 'PARAM$HANDLER$ZONE',
}

/**
 * Param injection.
 */
export interface ParamInjection {
  type: ParamInjectionType;
  value: string;
  declaration: 'Number' | 'String' | 'Boolean' | 'Object' | 'undefined' | 'Array' | 'Function';
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
export const baseParam = (type: ParamInjectionType | any) => {
  return (value: string = ''): ParameterDecorator => (target: any, prototype, index) => {
    // get param declaration type
    const { name: declaration } = Reflect.getMetadata('design:paramtypes', target, prototype)[index];
    // get existing params array
    const exists: ParamInjection[] = Metadata.get(target, prototype as string, MetadataKey.Parameter) || [];
    // put this param with special index
    exists[index] = { type, value, declaration };
    // and then, set it
    Metadata.set(target, prototype as string, MetadataKey.Parameter, exists);
  };
};

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
