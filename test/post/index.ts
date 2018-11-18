import { AMiddleware, RouterPaths } from '../../dist';
import { User } from '../entity';

const index: AMiddleware = async (c, next) => {
  const name = c.request.body.name;
  const user = await User.findOne({ name });
  if (user) {
    c.body = 'welcome';
  } else {
    c.body = 'sorry I do not know you';
  }
  next();
};

export const postPaths: RouterPaths = {
  '/': index
};

export default postPaths;
