import { HandlerType } from '../decorators';

/** Allowed HTTP methods. */
export enum Method {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

/**
 * Mapping, with method & path.
 */
export interface Mapping {
  method: Method;
  path: string;
  pathArray?: string[];
  query?: string;
  queryObject?: { [index: string]: string };
}

/**
 * Route.
 *
 * - View instance.
 * - Mapping
 *  - Method
 *  - Path
 * - Function name
 * - Target
 */
export interface Route {
  view: any;
  handlers: HandlerType[];
  mapping: Mapping;
  name: string;
  target: Function;
}

export * from './metadata-key';
export * from './request';
