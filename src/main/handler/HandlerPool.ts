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

  compose(current: BaseHandler, i: number, handlerTypes: HandlerType[]): () => any {
    if (i + 1 < handlerTypes.length) {
      // that is very very very, complex
      // 利用非立即执行函数的特性, 在 current.handle 调用 next 时再进行数据继承绑定
      // 才能正确的获取所有的属性（包括参数和已处理过的其他属性）
      // by the way, it will also make compose faster than before
      return async () => current.handle(() => this.compose(this.take(handlerTypes[++i]).inherit(current), i, handlerTypes)())
        .finally(() => this.give(current));
    } else {
      return async () => current.handle(current.run.bind(current))
        .finally(() => this.give(current));
    }
  }

}
