import { AMiddleware, RouterPaths, now } from '../../src';
import { User } from '../entity';
import test from './test';

const index: AMiddleware = async (c, next) => {
  // const insert = await User.insert({ name: now(), password: 'any' });
  // const user = await User.find();
  c.body = {
    status: true,
    data: c.request.body.name
  };
  next();
};

export const postPaths: RouterPaths = {
  '/test': {
    path: '/test',
    ware: test
  },
  'all': {
    path: /\/.*/,
    ware: index
  }
};

export default postPaths;
