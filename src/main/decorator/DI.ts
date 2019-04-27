export const Injectable: ClassDecorator = target => { };

export module DI {

  export function generate(target: any) {
    const providers = Reflect.getMetadata('design:paramtypes', target);
    const args = providers && providers.map((provider: any) => generate(provider));
    return args ? new target(...args) : new target();
  }

}
