import { MetadataKey } from '../constants';
import { Mapping, Method } from '../interfaces';

/**
 * Generate a mapping decorator.
 *
 * @param {Method} method Method name.
 */
const baseMapping = (method: Method) => {
  return (path: string = ''): MethodDecorator => (target: any, name, descriptor) => {
    const mappings: Mapping[] = Reflect.getMetadata(MetadataKey.Mapping, target, name) || [];
    Reflect.defineMetadata(MetadataKey.Mapping, [...mappings, { method, path }], target, name);
  };
};

/**
 * **CONNECT** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const CONNECT = baseMapping(Method.CONNECT);

/**
 * **DELETE** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const DELETE = baseMapping(Method.DELETE);

/**
 * **GET** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const GET = baseMapping(Method.GET);

/**
 * **HEAD** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const HEAD = baseMapping(Method.HEAD);

/**
 * **OPTIONS** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const OPTIONS = baseMapping(Method.OPTIONS);

/**
 * **PATCH** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const PATCH = baseMapping(Method.PATCH);

/**
 * **POST** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const POST = baseMapping(Method.POST);

/**
 * **PUT** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const PUT = baseMapping(Method.PUT);

/**
 * **TRACE** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const TRACE = baseMapping(Method.TRACE);
