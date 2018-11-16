import { IMiddleware } from 'koa-router';
import { Middleware } from 'koa';

const index: Middleware = async (c: any, next) => {
  c.body = c.request.body.index || 'no data';
  await next();
};

export const POSTPATHS = {
  '/': index
};

export default POSTPATHS;
