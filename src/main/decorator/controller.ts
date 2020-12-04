import { Injectable } from './injector';

/**
 * Class Decorator.
 *
 * Alias of `Injectable`, decorate a controller.
 */
export const Controller = () => Injectable({ type: 'controller' });
