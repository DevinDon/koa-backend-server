import { MetadataKey, Method } from '../@types';
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

interface Router {
  method: Method;
  path: string;
  name: string;
  target: Function;
  controller: any;
}

interface Mapping {
  method: Method;
  path: string;
}

type CoreRouter = {
  [index in Method]: Map<string, Router>;
};

/**
 * Core router mapping.
 *
 * Usage:
 *
 * `const mapping = CORE$ROUTER[method].get(path);`
 */
export const CORE$ROUTER: CoreRouter = {
  DELETE: new Map(),
  GET: new Map(),
  HEAD: new Map(),
  OPTIONS: new Map(),
  PATCH: new Map(),
  POST: new Map(),
  PUT: new Map()
};

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

export const PathQuery = baseParam(ParamInjectionType.PathQuery);
export const PathVariable = baseParam(ParamInjectionType.PathVariable);
export const RequestBody = baseParam(ParamInjectionType.RequestBody);
export const RequestHeader = baseParam(ParamInjectionType.RequestHeader);
export const HTTPRequest = baseParam(ParamInjectionType.HTTPRequest);
export const HTTPResponse = baseParam(ParamInjectionType.HTTPResponse);

function baseMethod(method: Method) {
  return (path: string = ''): MethodDecorator => (target: any, name, descriptor) => {
    Reflect.defineMetadata(MetadataKey.Method, { method, path }, target, name);
  };
}

export const DELETE = baseMethod('DELETE');
export const GET = baseMethod('GET');
export const HEAD = baseMethod('HEAD');
export const OPTIONS = baseMethod('OPTIONS');
export const PATCH = baseMethod('PATCH');
export const POST = baseMethod('POST');
export const PUT = baseMethod('PUT');

export function Controller(path: string = ''): ClassDecorator {
  return target => {
    const controller = Injector.generate(target);
    // TODO: maybe we will use it later
    // // define metadata: key = DECORATOR$CONTROLLER, value = controller, on = class
    // Reflect.defineMetadata(DECORATOR$CONTROLLER, controller, target);
    Object.getOwnPropertyNames(target.prototype)
      // exclude constructor
      .filter(v => v !== 'constructor')
      // put them on CORE$ROUTER
      .forEach(name => {
        const mapping: Mapping = Reflect.getMetadata(MetadataKey.Method, target.prototype, name);
        CORE$ROUTER[mapping.method].set(mapping.path = path + mapping.path, {
          method: mapping.method,
          path: mapping.path,
          name,
          target,
          controller
        });
      });
  };
}
