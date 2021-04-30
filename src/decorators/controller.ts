import { MetadataKey } from '../constants';
import type { BaseController } from '../core';
import { InjectedType, Injector } from './injector';
import { Metadata } from './metadata';

/** Controller class type. */
export type ControllerType = Function & typeof BaseController;

export interface ControllerMetadata {
  target: ControllerType;
  instance: BaseController;
}

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
    const metadata: ControllerMetadata = { target: target as any, instance: controller };
    Metadata.set(target, Metadata.PROTOTYPE_CONSTRUCTOR, MetadataKey.Controller, metadata);
  };
};
