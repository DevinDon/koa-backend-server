import { MetadataKey } from '../constants';
import { BaseView } from '../core';
import { InjectedType, Injector } from './injector';

/** View class type. */
export type ViewType = Function & typeof BaseView;

/**
 * Class Decorator.
 *
 * View decorator.
 *
 * @param {string} prefix View prefix, will add to all sub mapping.
 */
export const View = (prefix: string = ''): ClassDecorator => {
  prefix = '/' + prefix + '/';
  return target => {
    /** View instance. */
    const view = Injector.create({ target, type: InjectedType.VIEW }).instance;
    /** Define metadata on view class. */
    Reflect.defineMetadata(MetadataKey.View, { target, prefix, instance: view }, target);
  };
};
