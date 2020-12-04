import { MetadataKey } from '../interfaces';
import { BaseHandler } from '../handler';

/** Handler class type. */
export type HandlerType = Function & typeof BaseHandler;

/**
 * Class / Method decorator.
 *
 * Specify the handler to use for this view / method.
 *
 * If there are handlers on both view & method, handlers on method will
 * run first, and then run those on view.
 *
 * @param {HandlerType[]} handlers Handler class type.
 */
export function Handler(...handlers: typeof BaseHandler[]): ClassDecorator | MethodDecorator | any {
  return (target: Function | Object, name: string | symbol, descriptor: PropertyDecorator) => {
    if (target instanceof Function) { // if on class
      const result: HandlerType[] = (Reflect.getMetadata(MetadataKey.Handler, target) || []).concat(handlers);
      Reflect.defineMetadata(MetadataKey.Handler, result, target);
    } else { // if on method
      const result: HandlerType[] = (Reflect.getMetadata(MetadataKey.Handler, target, name) || []).concat(handlers);
      Reflect.defineMetadata(MetadataKey.Handler, result, target, name);
    }
  };
}
