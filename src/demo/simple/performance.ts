namespace PerformanceDemo {
  // tslint:disable: no-console

  function array() {
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const times = 10 * 10000;

    // push
    console.time('push');
    for (let i = 0; i < times; i++) {
      const temp = arr.push('1');
    }
    console.timeEnd('push');

    // pop
    console.time('pop');
    for (let i = 0; i < times; i++) {
      const temp = arr.pop();
    }
    console.timeEnd('pop');

    // unshift
    console.time('unshift');
    for (let i = 0; i < times; i++) {
      const temp = arr.unshift('1');
    }
    console.timeEnd('unshift');

    // shift
    console.time('shift');
    for (let i = 0; i < times; i++) {
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
    for (let i = 0; i < times; i++) {
      const result = await a();
    }
    console.timeEnd('await async');

    console.time('await sync');
    for (let i = 0; i < times; i++) {
      const result = await s();
    }
    console.timeEnd('await sync');

    console.time('sync');
    for (let i = 0; i < times; i++) {
      const result = s();
    }
    console.timeEnd('sync');

    console.time('async');
    for (let i = 0; i < times; i++) {
      let result;
      a().then(v => result = v);
    }
    console.timeEnd('async');

    console.time('async without return');
    for (let i = 0; i < times; i++) {
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
    for (let i = 0; i < times; i++) {
      const result = doit();
    }
    console.timeEnd('func');

    console.time('class');
    for (let i = 0; i < times; i++) {
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
    for (let i = 0; i < times; i++) {
      const result = map.get('1');
    }
    console.timeEnd('map');

    console.time('object');
    for (let i = 0; i < times; i++) {
      const result = obj[1];
    }
    console.timeEnd('object');

  }

  function regexp$string() {

    const times = 10 * 10000;
    const regexp = /abcabcabcabcabcabcabcabcabcabc/;
    const text = 'abcabcabcabcabcabcabcabcabcabc';

    console.time('regexp');
    for (let i = 0; i < times; i++) {
      const result = regexp.test('abcabcabcabcabcabcabcabcabcabc');
    }
    console.timeEnd('regexp');

    console.time('string');
    for (let i = 0; i < times; i++) {
      const result = text === 'abcabcabcabcabcabcabcabcabcabc';
    }
    console.timeEnd('string');

  }

  function splitString() {

    const times = 10 * 10000;
    const text = '/abc/def/ghi/jkl';

    console.time('split');
    for (let i = 0; i < times; i++) {
      const result = text.split('/');
    }
    console.timeEnd('split');

  }

  splitString();
}
