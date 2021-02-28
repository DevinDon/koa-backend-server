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
  private static storage: Map<any, Injected> = new Map();

  /**
   * Generate instance or get exist instance from storage.
   *
   * @param {any} target Target constructor.
   * @param {boolean} save Save to instances storage, default to true.
   * @returns {T} Instance.
   */
  static create<T = any>(
    { target, type = InjectedType.ANY, save = true }: { target: any, type?: InjectedType, save?: boolean }
  ): Injected<T> | undefined {
    const providers = Reflect.getMetadata('design:paramtypes', target);
    if (this.storage.has(target)) { // if instance already exists
      return this.storage.get(target);
    } else {
      // or generate it
      // recursive injection
      const args = providers && providers.map((provider: any) => this.create({ target: provider, type, save: false }));
      const obj: Injected<T> = args ? { instance: new (target as any)(...args), type } : { instance: new (target as any)(), type };
      if (save) {
        // save to instance storage
        this.storage.set(target, obj);
      }
      return obj;
    }
  }

  static get<T = any>(key: any): Injected<T> | undefined {
    return Injector.storage.get(key);
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
export function Injectable({ type }: { type: InjectedType } = { type: InjectedType.ANY }): ClassDecorator {
  return target => { Injector.create({ target, type }); };
}

/**
 * Property Decorator.
 *
 * Inject target property, like `@Autowried`.
 */
export function Inject(): PropertyDecorator {
  return (target, name) => {
    const instance = Injector.create({ target: target.constructor })?.instance;
    const inner = Injector.create({ target: Reflect.getMetadata('design:type', target, name) })?.instance;
    instance && (instance[name] = inner);
  };
}
