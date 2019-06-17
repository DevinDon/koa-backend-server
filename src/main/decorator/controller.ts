import { Mapping, MetadataKey, Route } from '../@types';
import { HandlerType } from './handler';
import { Injector } from './injector';

/**
 * Class Decorator.
 *
 * Controller decorator.
 *
 * @param {string} prefix Controller prefix, will add to all sub mapping.
 */
export function Controller(prefix: string = ''): ClassDecorator {
  return target => {
    /** Controller instance. */
    const controller = Injector.instance(target);
    /** Handler types on controller. */
    const handlersOnController: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target) || [];
    /** Routes on methods of this controller. */
    const routes: Route[] = Object.getOwnPropertyNames(target.prototype)
      // exclude constructor & method must be decorated by method decorator
      .filter(name => name !== 'constructor' && Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name))
      // map to a new array of Route
      .map<Route>(name => {
        const mapping: Mapping = Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name);
        const handlersOnMethod: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target.prototype, name) || [];
        const handlers: HandlerType[] = handlersOnMethod.concat(handlersOnController);
        mapping.path = prefix + mapping.path;
        return { controller, handlers, mapping, name, target };
      });
    // define metadata: key = MetadataKey.Controller, value = routes, on = class
    Reflect.defineMetadata(MetadataKey.Controller, routes, target);
  };
}
