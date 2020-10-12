import { Mapping, MetadataKey, Route } from '../@type';
import { HandlerType } from './handler';
import { Injector } from './injector';

/**
 * Class Decorator.
 *
 * View decorator.
 *
 * @param {string} prefix View prefix, will add to all sub mapping.
 */
export function View(prefix: string = ''): ClassDecorator {
  prefix = '/' + prefix + '/';
  return target => {
    /** View instance. */
    const view = Injector.instance(target);
    /** Handler types on view. */
    const handlersOnView: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target) || [];
    /** Routes on methods of this view. */
    const routes: Route[] = Object.getOwnPropertyNames(target.prototype)
      // exclude constructor & method must be decorated by method decorator
      .filter(name => name !== 'constructor' && Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name))
      // map to a new array of Route
      .map<Route[]>(name => {
        const mapping: Mapping[] = Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name);
        const handlersOnMethod: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target.prototype, name) || [];
        const handlers: HandlerType[] = handlersOnMethod.concat(handlersOnView);
        return mapping.map(v => {
          v.path = prefix + '/' + v.path;
          return { view: view, handlers, mapping: v, name, target };
        });
      }).flat();
    // define metadata: key = MetadataKey.View, value = routes, on = class
    Reflect.defineMetadata(MetadataKey.View, routes, target);
  };
}
