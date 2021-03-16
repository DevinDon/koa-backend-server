import { InjectedType, Injector } from './injector';

export const VIEWS: { target: Function, prefix: string, instance: any }[] = [];

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
    const view = Injector.create({ target, type: InjectedType.VIEW }).instance;
    /** Push view class into array. */
    VIEWS.push({ target, prefix, instance: view });
  };
}
