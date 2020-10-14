import { Mapping, MetadataKey, Method } from '../@type';

/**
 * Generate a mapping decorator.
 *
 * @param {Method} method Method name.
 */
function baseMapping(method: Method) {
  return (path: string = ''): MethodDecorator => (target: any, name, descriptor) => {
    const mapping: Mapping[] = Reflect.getMetadata(MetadataKey.Mapping, target, name) || [];
    mapping.push({ method, path });
    Reflect.defineMetadata(MetadataKey.Mapping, mapping, target, name);
  };
}

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
