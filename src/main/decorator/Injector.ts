/**
 * Dependency Injection, DI.
 *
 * Injector.
 */
export class Injector {

  /**
   * Instances storage, signal instance.
   */
  private static storage: Map<any, any> = new Map();

  /**
   * Generate instance or get exist instance from storage.
   *
   * @param {any} target Target constructor.
   * @param {boolean} save Save to instances storage, default to true.
   * @returns {T} Instance.
   */
  static generate<T = any>(target: any, save: boolean = true): T {
    const providers = Reflect.getMetadata('design:paramtypes', target);
    if (this.storage.has(target)) { // if instance already exists
      return this.storage.get(target);
    } else { // or generate it
      // recursive injection
      const args = providers && providers.map((provider: any) => this.generate(provider, false));
      const obj = args ? new target(...args) : new target();
      if (save) { // save to instance storage
        this.storage.set(target, obj);
      }
      return obj;
    }
  }

}

/**
 *
 * Class Decorator.
 *
 * Generate instance & save to storage.
 */
export function Injectable(): ClassDecorator {
  return target => {
    Injector.generate(target);
  };
}

/**
 * Property Decorator.
 *
 * Inject target property, like `@Autowried`.
 */
export function Inject(): PropertyDecorator {
  return (target, name) => {
    Injector.generate(target.constructor)[name] = Injector.generate(Reflect.getMetadata('design:type', target, name));
  };
}
