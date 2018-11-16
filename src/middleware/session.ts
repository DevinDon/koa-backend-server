import { Ware } from '../type';

export const session: Ware = async (c, next) => {
  const id = c.cookies.get('id') || `${Date.now()}${Math.round(Math.random() * 1000000)}`;
  c.cookies.set('id', id, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 三小时过期
    domain: '*'
  });
  await next();
};

export default session;
