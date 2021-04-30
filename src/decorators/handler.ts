import { MetadataKey } from '../constants';
import { BaseHandler } from '../handlers';
import { Metadata } from './metadata';

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
 * @param {HandlerType} handler Handler class type.
 */
export const Handler = <THandler extends typeof BaseHandler>(handler: THandler, config?: any): ClassDecorator | MethodDecorator | any => {
  config && handler && handler.config(config);
  return (target: Function | Object, prototype: string | symbol) => {
    if (target instanceof Function) { // if on class
      prototype = Metadata.PROTOTYPE_CONSTRUCTOR;
    }
    const handlers: HandlerType[] = Metadata.get(target, prototype as string, MetadataKey.Handler) || [];
    Metadata.set(target, prototype as string, MetadataKey.Handler, [...handlers, handler]);
  };
};
