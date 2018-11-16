import { IWare, RouterPaths, Root } from '../../dist';
import test from './test';
import time from './time';

const index: IWare = async (c, next) => {
  c.response.body = new Date().toLocaleTimeString() || 'no data';
  await next();
};

const postPaths: RouterPaths = {
  '/': index,
  '/test': test,
  '/time': time
};

export default postPaths;
