import { Ware } from '../type';
import { formatTime, now } from '../util';

/**
 * Logger 中间件: 输出请求信息.
 * @param c Context
 * @param next Next
 */
export const logger: Ware = async (c, next) => {
  try {
    await next();
    console.log(`${now()}: ${c.request.method} ${c.request.path}`);
  } catch (err) {
    console.error(`${now()}: ${c.request.method} ${c.request.path} has some error: ${err}`);
    c.response.status = err.status || 600;
  }
};

export default logger;
