export enum InjectedType {
  CONTROLLER = 'CONTROLLER',
  VIEW = 'VIEW',
  ANY = 'ANY'
}

export interface Injected<T = any> {
  type: InjectedType;
  instance: T;
}

/**
 * Dependency Injection, DI.
 *
 * Injector.
 */
export class Injector {

  /**
   * Instances storage, signal instance.
   */
  public static readonly storage: Map<any, Injected> = new Map();

  /**
   * Generate instance or get exist instance from storage.
   *
   * @param {any} target Target constructor.
   * @param {boolean} save Save to instances storage, default to true.
   * @returns {T} Instance.
   */
  static create<T = any>(
    { target, type, save = true }: { target: any, type?: InjectedType, save?: boolean },
  ): Injected<T> {
    const providers = Reflect.getMetadata('design:paramtypes', target);
    if (this.storage.has(target)) { // if instance already exists
      const injected = this.storage.get(target)!;
      // fix: view create after controller will be 'ANY' type
      injected.type = type ?? injected.type;
      return injected;
    } else { // or generate it
      // fix type
      type = type ?? InjectedType.ANY;
      // recursive injection
      const args = providers && providers.map((provider: any) => this.create({ target: provider, type, save: false }));
      const injected: Injected<T> = args ? { instance: new (target as any)(...args), type } : { instance: new (target as any)(), type };
      if (save) {
        // save to instance storage
        this.storage.set(target, injected);
      }
      return injected;
    }
  }

  static get<T = any>(key: any): Injected<T> | undefined {
    return Injector.storage.get(key);
  }

  static keys() {
    return Array.from(this.storage.keys());
  }

  static list() {
    return Array.from(this.storage.values());
  }

}

/**
 *
 * Class Decorator.
 *
 * Generate instance & save to storage.
 */
export const Injectable = ({ type }: { type: InjectedType } = { type: InjectedType.ANY }): ClassDecorator => {
  return target => { Injector.create({ target, type }); };
};

/**
 * Property Decorator.
 *
 * Inject target property, like `@Autowried`.
 */
export const Inject = (): PropertyDecorator => {
  return (target, name) => {
    const instance = Injector.create({ target: target.constructor }).instance;
    const inner = Injector.create({ target: Reflect.getMetadata('design:type', target, name) }).instance;
    instance && (instance[name] = inner);
  };
};
