import { InjectedType, Injector } from './injector';

export const CONTROLLERS: { target: Function, instance: any }[] = [];

/**
 * Class Decorator.
 *
 * Alias of `Injectable`, decorate a controller.
 */
export const Controller = (): ClassDecorator => {
  return target => {
    /** Controller instance. */
    const controller = Injector.create({ target, type: InjectedType.CONTROLLER }).instance;
    /** Push controller class into array. */
    CONTROLLERS.push({ target, instance: controller });
  };
};
