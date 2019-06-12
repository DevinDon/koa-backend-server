import { HandlerType } from '../decorator';

/** Allowed HTTP methods. */
export type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';

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
 * - Controller instance.
 * - Mapping
 *  - Method
 *  - Path
 * - Function name
 * - Target
 */
export interface Route {
  controller: any;
  handlerTypes: HandlerType[];
  mapping: Mapping;
  name: string;
  target: Function;
}

export * from './MetadataKey';
