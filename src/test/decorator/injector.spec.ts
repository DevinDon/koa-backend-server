import 'reflect-metadata';
import { Injector, Injectable, Inject } from '../../main/decorator/injector';

describe('injector', () => {

  it('should generate instance', done => {
    class ABC {
      name: string = 'ABC';
      hello() {
        return `Hello, ${this.name}!`;
      }
    }
    const instance = Injector.instance(ABC);
    expect(instance).toBeDefined();
    expect(instance.name).toEqual('ABC');
    expect(instance.hello).toBeDefined();
    expect(instance.hello()).toEqual(`Hello, ${instance.name}!`);
    done();
  });

  it('should auto generate instance with @Injectable()', done => {
    @Injectable()
    class ABC {
      name: string = 'ABC';
      hello() {
        return `Hello, ${this.name}!`;
      }
    }
    const instance = Injector['storage'].get(ABC);
    expect(instance).toBeDefined();
    expect(instance.name).toEqual('ABC');
    expect(instance.hello).toBeDefined();
    expect(instance.hello()).toEqual(`Hello, ${instance.name}!`);
    done();
  });

  it('should auto generate instance properties with @Inject()', done => {
    @Injectable()
    class ABC {
      name() {
        return 'ABC';
      }
    }
    @Injectable()
    class DEF {
      @Inject()
      abc!: ABC;
      hello() {
        return `Hello, ${this.abc.name()}!`;
      }
    }
    const instanceABC = Injector.instance(ABC);
    expect(instanceABC).toBeDefined();
    expect(instanceABC.name()).toEqual('ABC');
    const instanceDEF = Injector.instance(DEF);
    expect(instanceDEF.hello).toBeDefined();
    expect(instanceDEF.hello()).toEqual(`Hello, ${instanceABC.name()}!`);
    done();
  });

});
