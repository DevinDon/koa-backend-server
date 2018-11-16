import { IWare } from '../../dist';

export const test: IWare = async (c, next) => {
  c.response.body = 'This is a test api.';
  await next();
};

export default test;
