namespace PerformanceDemo {
  // tslint:disable: no-console

  function array() {
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const times = 10 * 10000;

    // push
    console.time('push');
    for (let i = times; i; i--) {
      const temp = arr.push('1');
    }
    console.timeEnd('push');

    // pop
    console.time('pop');
    for (let i = times; i; i--) {
      const temp = arr.pop();
    }
    console.timeEnd('pop');

    // unshift
    console.time('unshift');
    for (let i = times; i; i--) {
      const temp = arr.unshift('1');
    }
    console.timeEnd('unshift');

    // shift
    console.time('shift');
    for (let i = times; i; i--) {
      const temp = arr.shift();
    }
    console.timeEnd('shift');

  }

  async function a() {
    const result = 1;
    return result;
  }

  function s() {
    const result = 1;
    return result;
  }

  async function sync() {

    const times = 10 * 10000;

    console.time('await async');
    for (let i = times; i; i--) {
      const result = await a();
    }
    console.timeEnd('await async');

    console.time('await sync');
    for (let i = times; i; i--) {
      const result = await s();
    }
    console.timeEnd('await sync');

    console.time('sync');
    for (let i = times; i; i--) {
      const result = s();
    }
    console.timeEnd('sync');

    console.time('async');
    for (let i = times; i; i--) {
      let result;
      a().then(v => result = v);
    }
    console.timeEnd('async');

    console.time('async without return');
    for (let i = times; i; i--) {
      const result = a();
    }
    console.timeEnd('async without return');
  }

  class ABC {
    doit() {
      const result = '1';
      return result;
    }
  }

  function doit() {
    const result = '1';
    return result;
  }

  function class$function() {

    const times = 10 * 10000;

    console.time('func');
    for (let i = times; i; i--) {
      const result = doit();
    }
    console.timeEnd('func');

    console.time('class');
    for (let i = times; i; i--) {
      const result = new ABC().doit();
    }
    console.timeEnd('class');

  }

  function map$object() {

    const times = 100 * 10000;
    const map = new Map();
    map.set('1', '1');
    const obj = { '1': '1' };
    console.log(map.get('1'), obj['1']);

    console.time('map');
    for (let i = times; i; i--) {
      const result = map.get('1');
    }
    console.timeEnd('map');

    console.time('object');
    for (let i = times; i; i--) {
      const result = obj[1];
    }
    console.timeEnd('object');

  }

  function regexp$string() {

    const times = 10 * 10000;
    const regexp = /abcabcabcabcabcabcabcabcabcabc/;
    const text = 'abcabcabcabcabcabcabcabcabcabc';

    console.time('regexp');
    for (let i = times; i; i--) {
      const result = regexp.test('abcabcabcabcabcabcabcabcabcabc');
    }
    console.timeEnd('regexp');

    console.time('string');
    for (let i = times; i; i--) {
      const result = text === 'abcabcabcabcabcabcabcabcabcabc';
    }
    console.timeEnd('string');

  }

  function splitString() {

    const times = 10 * 10000;
    const text = '/abc/def/ghi/jkl';

    console.time('split');
    for (let i = times; i; i--) {
      const result = text.split('/');
    }
    console.timeEnd('split');

  }

  function mapStringKey$mapFunctionKey() {

    const times = 10 * 10000;
    const mapStringKey = new Map();
    mapStringKey.set(ABC.name, ABC);
    const mapFunctionKey = new Map();
    mapFunctionKey.set(ABC, ABC);

    console.time('string');
    for (let i = times; i; i--) {
      const result = mapStringKey.get(ABC.name);
    }
    console.timeEnd('string');

    console.time('function');
    for (let i = times; i; i--) {
      const result = mapFunctionKey.get(ABC);
    }
    console.timeEnd('function');

  }

  function bind() {

    const times = 10 * 10000;

    class DEF {
      age = 1;
      hello() {
        return this.age;
      }
    }

    const def = new DEF();

    console.time('bind');
    for (let i = times; i; i--) {
      const result = def.hello.bind(def)();
    }
    console.timeEnd('bind');

    console.time('no');
    for (let i = times; i; i--) {
      const result = def.hello();
    }
    console.timeEnd('no');

  }

  bind();

}
