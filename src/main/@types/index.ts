export * from './option';
export * from './service';

/**
 * Metadata key, symbol.
 */
export namespace MetadataKey {

  /**
   * Metadata key in Parameter.
   */
  export const Parameter = Symbol('Parameter');

  /**
   * Metadata key in Method.
   */
  export const Method = Symbol('Method');

  /**
   * Metadata key in Controller.
   */
  export const Controller = Symbol('Controller');

  /**
   * Metadata key in Handler.
   */
  export const Handler = Symbol('Handler');

}
