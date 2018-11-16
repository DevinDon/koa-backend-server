import { IWare, RouterPaths } from '../../dist';
import test from './test';
import time from './time';

/**
 * 路径: /
 * @param c Context.
 * @param next Next.
 */
const index: IWare = async (c, next) => {
  c.response.body = 'Hello, this is an api server.';
  await next();
};

/** 所有 GET 方式的路径. */
const getPaths: RouterPaths = {
  '/': index,
  '/test': test,
  '/time': time
};

export default getPaths;
