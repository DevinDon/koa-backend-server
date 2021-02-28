import 'reflect-metadata';
import { Inject, Injectable, Injector } from '../../main/decorators/injector';

describe('injector', () => {

  it('should generate instance', done => {
    class ABC {
      username: string = 'Class ABC';
      hello() {
        return `Hello, ${this.username}!`;
      }
    }
    const injected = Injector.create<ABC>({ target: ABC });
    expect(injected).toBeDefined();
    const instance = injected!.instance;
    expect(instance).toBeDefined();
    expect(instance.username).toEqual('Class ABC');
    expect(instance.hello).toBeDefined();
    expect(instance.hello()).toEqual(`Hello, ${instance.username}!`);
    done();
  });

  it('should auto generate instance with @Injectable()', done => {
    @Injectable()
    class DEF {
      username: string = 'DEF';
      hello() {
        return `Hello, ${this.username}!`;
      }
    }
    const injected = Injector.get<DEF>(DEF);
    expect(injected).toBeDefined();
    const instance = injected!.instance;
    expect(instance).toBeDefined();
    expect(instance.username).toEqual('DEF');
    expect(instance.hello).toBeDefined();
    expect(instance.hello()).toEqual(`Hello, ${instance.username}!`);
    done();
  });

  it('should auto generate instance properties with @Inject()', done => {
    @Injectable()
    class GHI {
      get name() {
        return 'GHI';
      }
    }
    @Injectable()
    class JKL {
      @Inject()
      ghi!: GHI;
      hello() {
        return `Hello, ${this.ghi.name}!`;
      }
    }
    const injectedGHI = Injector.create<GHI>({ target: GHI });
    expect(injectedGHI).toBeDefined();
    const instanceGHI = injectedGHI!.instance;
    expect(instanceGHI).toBeDefined();
    expect(instanceGHI.name).toEqual('GHI');
    const injectedJKL = Injector.create<JKL>({ target: JKL });
    expect(injectedJKL).toBeDefined();
    const instanceJKL = injectedJKL!.instance;
    expect(instanceJKL).toBeDefined();
    expect(instanceJKL.ghi).toEqual(instanceGHI);
    expect(instanceJKL.hello()).toEqual(`Hello, ${instanceGHI.name}!`);
    done();
  });

});
