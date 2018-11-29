import { AMiddleware, RouterPaths, now } from '../../dist';
import { User } from '../entity';

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
  '/': index
};

export default postPaths;
