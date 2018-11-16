import { IWare } from '../../dist';

export const test: IWare = async (c, next) => {
  c.response.body = { text: 'ok' };
  // console.log(`body: ${c.request.body}`);
  await next();
};

export default test;
