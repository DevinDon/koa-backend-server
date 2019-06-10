import { inspect } from 'util';
import { HandlerType } from '../decorator';
import { BaseHandler, HandlerOption } from './BaseHandler';
import { ParameterHandler } from './ParamterHandler';

/**
 * Handler pool.
 */
export class HandlerPool {

  /** Maximum number of handlers per category, default to 10000. */
  private max = 100 * 100;
  /** Pool. */
  private pools: Map<string, BaseHandler[]> = new Map();

  /** Handler types, default to `[ExceptionHandler, SchemaHandler, ParameterHandler]` */
  handlerTypes: HandlerType[] = [ParameterHandler];

  /**
   * Take one hander instance with special type.
   *
   * @param {HandlerType} type Handler type.
   * @returns {T} A handler instance with special type.
   */
  take<T = BaseHandler>(type: HandlerType): T {
    const pool = this.pools.get(type.name)! || this.pools.set(type.name, []).get(type.name)!;
    return pool.pop() || new type() as any;
  }

  /**
   * Give back this handler to pool.
   *
   * @param {BaseHandler} handler Handler instance.
   * @returns {number} Number of handlers in pool.
   */
  give(handler: BaseHandler): number {
    const pool = this.pools.get(handler.constructor.name)! || this.pools.set(handler.constructor.name, []).get(handler.constructor.name)!;
    return pool.length < this.max ? pool.push(handler.init()) : pool.length;
  }

  /**
   * Process request.
   *
   * @param {HandlerOption} option Handler option.
   */
  async process(option: HandlerOption): Promise<void> {
    // TODO: refactor by ExceptionHandler
    try {
      const handlerTypes = this.handlerTypes.concat(option.route.handlerTypes || []);
      const result = await this.compose(this.take(handlerTypes[0]).init(option), 0, handlerTypes)();
      option.response.end(JSON.stringify(result));
    } catch (exception) {
      option.response.writeHead(exception.code || 600, exception.message);
      option.response.end(inspect(exception.content, true));
    }
  }

  /**
   * Compose all handler.
   *
   * @param {THandler extends BaseHandler} current Current handler instance.
   * @param {number} i Index of handler types in this request.
   * @param {HandlerType[]} handlerTypes Handler types in this request.
   * @returns {() => any} Composed function.
   */
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
