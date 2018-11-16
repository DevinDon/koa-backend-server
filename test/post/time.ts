import { IWare } from '../../dist';

export const time: IWare = async (c, next) => {
  c.response.body = new Date().toLocaleTimeString() || 'no data';
  await next();
};

export default time;
