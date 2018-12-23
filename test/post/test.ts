import { Middleware } from 'koa';

export const test: Middleware = async (c, next) => {
  const a = c.request.body;
  c.body = {
    data: c.session
  };
  await next();
};

export default test;
