import { IWare, formatTime } from '../../dist';

export const time: IWare = async (c, next) => {
  c.response.body = formatTime(new Date());
  await next();
};

export default time;
