import { MetadataKey } from '../constants';
import { BaseView } from '../core';
import { InjectedType, Injector } from './injector';
import { Metadata } from './metadata';

/** View class type. */
export type ViewType = Function & typeof BaseView;

export interface ViewMetadata {
  target: ViewType;
  prefix: string;
  instance: BaseView;
}

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
    const metadata: ViewMetadata = { target: target as any, prefix, instance: view };
    Metadata.set(target, Metadata.PROTOTYPE_CONSTRUCTOR, MetadataKey.View, metadata);
  };
};
