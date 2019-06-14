import { MetadataKey } from '../@types';
import { BaseHandler } from '../handler';

/** Handler class type. */
export type HandlerType = Function & typeof BaseHandler;

/**
 * Class / Method decorator.
 *
 * Specify the handler to use for this controller / method.
 *
 * If there are handlers on both controller & method, handlers on method will
 * run first, and then on controller.
 *
 * @param {HandlerType} handler Handler class type.
 */
export function Handler(handler: typeof BaseHandler): ClassDecorator | MethodDecorator | any {
  return (target: Function | Object, name: string | symbol, descriptor: PropertyDecorator) => {
    if (target instanceof Function) { // if on class
      const handlers: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target) || [];
      handlers.push(handler);
      Reflect.defineMetadata(MetadataKey.Handler, handlers, target);
    } else { // if on method
      const handlers: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target, name) || [];
      handlers.push(handler);
      Reflect.defineMetadata(MetadataKey.Handler, handlers, target, name);
    }
  };
}
