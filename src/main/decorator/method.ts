import { MetadataKey, Method } from '../@types';

/**
 * Generate a method decorator.
 *
 * @param {Method} method Method name.
 */
function baseMethod(method: Method) {
  return (path: string = ''): MethodDecorator => (target: any, name, descriptor) => {
    Reflect.defineMetadata(MetadataKey.Mapping, { method, path }, target, name);
  };
}

/**
 * **CONNECT** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const CONNECT = baseMethod(Method.CONNECT);

/**
 * **DELETE** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const DELETE = baseMethod(Method.DELETE);

/**
 * **GET** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const GET = baseMethod(Method.GET);

/**
 * **HEAD** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const HEAD = baseMethod(Method.HEAD);

/**
 * **OPTIONS** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const OPTIONS = baseMethod(Method.OPTIONS);

/**
 * **PATCH** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const PATCH = baseMethod(Method.PATCH);

/**
 * **DELETE** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const POST = baseMethod(Method.POST);

/**
 * **PUT** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const PUT = baseMethod(Method.PUT);

/**
 * **TRACE** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const TRACE = baseMethod(Method.TRACE);
