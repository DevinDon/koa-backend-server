import { MetadataKey } from '../constants';
import { Mapping, Method } from '../interfaces';
import { Metadata } from './metadata';

/**
 * Generate a mapping decorator.
 *
 * @param {Method} method Method name.
 */
const baseMapping = (method: Method) => {
  return (path: string = ''): MethodDecorator => ({ constructor: target }, prototype) => {
    const mappings: Mapping[] = Metadata.get(target, prototype as string, MetadataKey.Mapping) || [];
    Metadata.set(target, prototype as string, MetadataKey.Mapping, [...mappings, { method, path }]);
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
