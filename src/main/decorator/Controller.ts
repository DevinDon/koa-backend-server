import { MetadataKey, Method } from '../@types';
import { Mapping, Router } from '../Router';
import { HandlerType } from './Handler';
import { Injector } from './Injector';

/**
 * Param injection type.
 */
export enum ParamInjectionType {
  PathQuery = 'PARAM$PATH$QUERY',
  PathVariable = 'PARAM$PATH$VARIABLE',
  RequestBody = 'PARAM$REQUEST$BODY',
  RequestHeader = 'PARAM$REQUEST$HEADER',
  HTTPRequest = 'PARAM$HTTP$REQUEST',
  HTTPResponse = 'PARAM$HTTP$RESPONSE'
}

/**
 * Param injection.
 */
export interface ParamInjection {
  type: ParamInjectionType;
  value: string;
}

const router: Router = Injector.generate(Router);

/**
 * Generate a Parameter Decorator.
 *
 * @param {ParamInjectionType} type ParamInjectionType, as:
 * - PathQuery
 * - PathVariable
 * - RequestBody
 * - RequestHeader
 * - HTTPRequest
 * - HTTPResponse
 */
function baseParam(type: ParamInjectionType) {
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
 * Parameter Decorator.
 *
 * Inject query object to param.
 *
 * @param {string} value Query key.
 */
export const PathQuery = baseParam(ParamInjectionType.PathQuery);
export const PathVariable = baseParam(ParamInjectionType.PathVariable);
export const RequestBody = baseParam(ParamInjectionType.RequestBody);
export const RequestHeader = baseParam(ParamInjectionType.RequestHeader);
export const HTTPRequest = baseParam(ParamInjectionType.HTTPRequest);
export const HTTPResponse = baseParam(ParamInjectionType.HTTPResponse);

function baseMethod(method: Method) {
  return (path: string = ''): MethodDecorator => (target: any, name, descriptor) => {
    Reflect.defineMetadata(MetadataKey.Mapping, { method, path }, target, name);
  };
}

export const DELETE = baseMethod('DELETE');
export const GET = baseMethod('GET');
export const HEAD = baseMethod('HEAD');
export const OPTIONS = baseMethod('OPTIONS');
export const PATCH = baseMethod('PATCH');
export const POST = baseMethod('POST');
export const PUT = baseMethod('PUT');

/**
 * Class Decorator.
 *
 * Controller decorator.
 *
 * @param prefix Controller prefix, will add to all sub mapping.
 */
export function Controller(prefix: string = ''): ClassDecorator {
  return target => {
    const controller = Injector.generate(target);
    const handlerTypes: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target) || [];
    // TODO: maybe we will use it later
    // // define metadata: key = DECORATOR$CONTROLLER, value = controller, on = class
    // Reflect.defineMetadata(DECORATOR$CONTROLLER, controller, target);
    Object.getOwnPropertyNames(target.prototype)
      // exclude constructor
      .filter(v => v !== 'constructor')
      // put them on Router.router
      .forEach(name => {
        const mapping: Mapping = Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name);
        if (mapping) {
          mapping.path = prefix + mapping.path;
          router.set({ controller, handlerTypes: handlerTypes.concat(Reflect.getMetadata(MetadataKey.Handler, target.prototype, name) || []), mapping, name, target });
        }
      });
  };
}
