import { AMiddleware, RouterPaths } from '../../dist';

const index: AMiddleware = async (c, next) => {
  c.body = c.request.body.index || 'no data';
  if (c.session) {
    let n = c.session.n || 0;
    c.session.n = ++n;
    c.body += n;
  }
  await next();
};

export const postPaths: RouterPaths = {
  '/': index
};

export default postPaths;
