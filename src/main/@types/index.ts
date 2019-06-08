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
   * Metadata key in Mapping.
   */
  export const Mapping = Symbol('Mapping');

  /**
   * Metadata key in Controller.
   */
  export const Controller = Symbol('Controller');

  /**
   * Metadata key in Handler.
   */
  export const Handler = Symbol('Handler');

}
