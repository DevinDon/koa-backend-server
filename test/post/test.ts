import { Middleware } from 'koa';

export const test: Middleware = async (c, next) => {
  c.body = {
    data: c.session
  };
  await next();
};

export default test;
