import { MetadataKey } from '../@types';
import { BaseHandler } from '../handler';

export type HandlerType = Function & typeof BaseHandler;

export function Handler(handler: typeof BaseHandler): ClassDecorator | MethodDecorator | any {
  return (target: Function | Object, name: string | symbol, descriptor: PropertyDecorator) => {
    if (target instanceof Function) {
      const array: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target) || [];
      array.push(handler);
      Reflect.defineMetadata(MetadataKey.Handler, array, target);
    } else {
      const array: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target, name) || [];
      array.push(handler);
      Reflect.defineMetadata(MetadataKey.Handler, array, target, name);
    }
  };
}
