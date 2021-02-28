import { Injectable, InjectedType } from './injector';

/**
 * Class Decorator.
 *
 * Alias of `Injectable`, decorate a controller.
 */
export const Controller = () => Injectable({ type: InjectedType.CONTROLLER });
