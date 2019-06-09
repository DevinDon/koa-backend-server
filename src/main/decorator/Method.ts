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
 * **DELETE** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const DELETE = baseMethod('DELETE');

/**
 * **GET** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const GET = baseMethod('GET');

/**
 * **HEAD** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const HEAD = baseMethod('HEAD');

/**
 * **OPTIONS** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const OPTIONS = baseMethod('OPTIONS');

/**
 * **PATCH** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const PATCH = baseMethod('PATCH');

/**
 * **DELETE** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const POST = baseMethod('POST');

/**
 * **PUT** Method decorator.
 *
 * @param {string} path Path to mapping.
 */
export const PUT = baseMethod('PUT');
