import { MetadataKey } from '../constants';
import { BaseController } from '../core';
import { InjectedType, Injector } from './injector';

/** Controller class type. */
export type ControllerType = Function & typeof BaseController;

/**
 * Class Decorator.
 *
 * Alias of `Injectable`, decorate a controller.
 */
export const Controller = (): ClassDecorator => {
  return target => {
    /** Controller instance. */
    const controller = Injector.create({ target, type: InjectedType.CONTROLLER }).instance;
    /** Define metadata on class. */
    Reflect.defineMetadata(MetadataKey.Controller, { target, instance: controller }, target);
  };
};
