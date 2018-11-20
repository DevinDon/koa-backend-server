import { AMiddleware, RouterPaths, now } from '../../dist';
import { User } from '../entity';

const index: AMiddleware = async (c, next) => {
  const insert = await User.insert({ name: now(), password: 'any' });
  const user = await User.find();
  c.body = {
    status: insert ? true : false,
    data: user
  };
  next();
};

export const postPaths: RouterPaths = {
  '/': index
};

export default postPaths;
