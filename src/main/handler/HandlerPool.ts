import { inspect } from 'util';
import { HandlerType } from '../decorator';
import { BaseHandler, HandlerOption } from './BaseHandler';
import { CoreHandler } from './CoreHandler';

export class HandlerPool {

  static max = 100 * 100;
  static order: HandlerType[] = [CoreHandler];
  static pools: Map<string, BaseHandler[]> = new Map();

  static take<T = BaseHandler>(type: HandlerType): T {
    const pool = HandlerPool.pools.get(type.name)! || HandlerPool.pools.set(type.name, []).get(type.name)!;
    return pool.pop() || new type() as any;
  }

  static give(handler: BaseHandler): number {
    const pool = HandlerPool.pools.get(handler.constructor.name)! || HandlerPool.pools.set(handler.constructor.name, []).get(handler.constructor.name)!;
    return pool.length < HandlerPool.max ? pool.push(handler.init()) : pool.length;
  }

  static async process(option: HandlerOption): Promise<void> {
    // TODO: refactor
    try {
      const result = await HandlerPool.compose(HandlerPool.take(HandlerPool.order[0]).init(option), 0)();
      option.response.end(JSON.stringify(result));
    } catch (error) {
      const exception = error;
      option.response.writeHead(exception.code || 600, exception.message);
      option.response.end(inspect(exception.content, true));
    }
  }

  static compose(current: BaseHandler, i: number): () => any {
    if (i + 1 < HandlerPool.order.length) {
      const next = HandlerPool.take(HandlerPool.order[i]).inherit(current);
      return async () => current.handle(HandlerPool.compose(next, i + 1)).finally(() => HandlerPool.give(current));
    } else {
      return async () => current.handle(current.run.bind(current)).finally(() => HandlerPool.give(current));
    }
  }

}
