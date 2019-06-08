import { inspect } from 'util';
import { HandlerType } from '../decorator';
import { BaseHandler, HandlerOption } from './BaseHandler';
import { CoreHandler } from './CoreHandler';

export class HandlerPool {

  private max = 100 * 100;
  private order: HandlerType[] = [CoreHandler, CoreHandler];
  private pools: Map<string, BaseHandler[]> = new Map();

  take<T = BaseHandler>(type: HandlerType): T {
    const pool = this.pools.get(type.name)! || this.pools.set(type.name, []).get(type.name)!;
    return pool.pop() || new type() as any;
  }

  give(handler: BaseHandler): number {
    const pool = this.pools.get(handler.constructor.name)! || this.pools.set(handler.constructor.name, []).get(handler.constructor.name)!;
    return pool.length < this.max ? pool.push(handler.init()) : pool.length;
  }

  async process(option: HandlerOption): Promise<void> {
    // TODO: refactor
    try {
      const handlerTypes = this.handlerTypes.concat(option.route.handlerTypes || []);
      const result = await this.compose(this.take(handlerTypes[0]).init(option), 0, handlerTypes)();
      option.response.end(JSON.stringify(result));
    } catch (error) {
      const exception = error;
      option.response.writeHead(exception.code || 600, exception.message);
      option.response.end(inspect(exception.content, true));
    }
  }

  compose(current: BaseHandler, i: number): () => any {
    if (i + 1 < this.order.length) {
      const next = this.take(this.order[i]).inherit(current);
      return async () => current.handle(this.compose(next, i + 1)).finally(() => this.give(current));
    } else {
      return async () => current.handle(current.run.bind(current)).finally(() => this.give(current));
    }
  }

}
