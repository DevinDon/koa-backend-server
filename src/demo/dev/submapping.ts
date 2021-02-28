import { logger } from '@iinfinity/logger';

namespace SubMappingDemo {
  const text = '/date/{{year}}/{{month}}/{{day}}';

  const router = {
    DELETE: new Map(),
    GET: new Map(),
    HEAD: new Map(),
    OPTIONS: new Map(),
    PATCH: new Map(),
    POST: new Map(),
    PUT: new Map()
  };

  const method = 'POST';
  const arr = text.split('/').filter(v => v !== '');
  arr.reduce((pre, cur, i, a) => {
    if (i === 1) {
      const p: Map<string, any> = (router[method].has(pre) ? router[method] : router[method].set(pre, new Map())).get(pre);
      return (p.has(cur) ? p : p.set(cur, new Map())).get(cur);
    } else {
      const map = pre as any as Map<string, any>;
      if (i === a.length - 1) {
        return map.has(cur) ? map.get(cur).set('', 'Function') : map.set(cur, new Map()).get(cur).set('', 'Function');
      } else {
        return map.has(cur) ? map.get(cur) : map.set(cur, new Map()).get(cur);
      }
    }
  });

  logger.log(router);
}
