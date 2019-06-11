import { MetadataKey } from '../@types';
import { Mapping, Router } from '../Router';
import { HandlerType } from './Handler';
import { Injector } from './Injector';

const router: Router = Injector.generate(Router);

/**
 * Class Decorator.
 *
 * Controller decorator.
 *
 * @param {string} prefix Controller prefix, will add to all sub mapping.
 */
export function Controller(prefix: string = ''): ClassDecorator {
  return target => {
    const controller = Injector.instance(target);
    const handlerTypesOnController: HandlerType[] = Reflect.getMetadata(MetadataKey.Handler, target) || [];
    // TODO: maybe we will use it later
    // // define metadata: key = DECORATOR$CONTROLLER, value = controller, on = class
    // Reflect.defineMetadata(DECORATOR$CONTROLLER, controller, target);
    Object.getOwnPropertyNames(target.prototype)
      // exclude constructor
      .filter(v => v !== 'constructor')
      // put them on Router.router
      .forEach(name => {
        const mapping: Mapping = Reflect.getMetadata(MetadataKey.Mapping, target.prototype, name);
        if (mapping) {
          mapping.path = prefix + mapping.path;
          // set route to each mapping
          router.set({ controller, handlerTypes: (Reflect.getMetadata(MetadataKey.Handler, target.prototype, name) || []).concat(handlerTypesOnController), mapping, name, target });
        }
      });
  };
}
