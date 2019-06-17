import 'reflect-metadata';
import { Injector } from '../../main/decorator/injector';

describe('injector', () => {

  class ABC {
    name: string = 'ABC';
    hello() {
      return `Hello, ${name}!`;
    }
  }

  it('should generate instance', done => {
    const instance = Injector.instance(ABC);
    expect(instance).toBeDefined();
    expect(instance.name).toEqual('ABC');
    expect(instance.hello).toBeDefined();
    expect(instance.hello()).toEqual(`Hello, ${instance.name}!`);
    done();
  });

});
