import { HandlerType } from '../decorator';
import { BaseHandler } from './BaseHandler';

/**
 * Handler pool.
 */
export class HandlerPool {

  /** Maximum number of handlers per category, default to 1024. */
  private max = 1024;
  /** Pools. */
  private pools: Map<string, BaseHandler[]> = new Map();

  /** Handler types, default to empty. */
  handlerTypes: HandlerType[] = [];

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
   * Process request & response in HTTP/S/2 server.
   *
   * @param {IncomingMessage} request Request.
   * @param {ServerResponse} response Response.
   */
  async process(request: any, response: any): Promise<void> {
    // take & compose these handlers
    this.compose(this.take(this.handlerTypes[0]).init({ request, response }), 0, this.handlerTypes)()
      .then(v => response.write(v))
      .finally(() => response.end());
  }

  /**
   * Compose all handler.
   *
   * @param {THandler extends BaseHandler} current Current handler instance.
   * @param {number} i Index of handler types in this request.
   * @param {HandlerType[]} handlerTypes Handler types in this request.
   * @returns {() => Promise<any>} Composed function.
   */
  compose(current: BaseHandler, i: number, handlerTypes: HandlerType[]): () => Promise<any> {
    if (i + 1 < handlerTypes.length) {
      // that is very very very, complex
      // 利用非立即执行函数的特性, 在 current.handle 调用 next 时再进行数据继承绑定
      // 才能正确的获取所有的属性（包括参数和已处理过的其他属性）
      // by the way, it will also make compose faster than before
      return async () => current.handle(() => this.compose(this.take(handlerTypes[++i]).inherit(current), i, handlerTypes)())
        .finally(() => this.give(current));
    } else if (handlerTypes === this.handlerTypes && current.route.handlerTypes.length) { // global handlers has been composed, and handler.route.HandlerTypes should exist
      handlerTypes = current.route.handlerTypes;
      return async () => current.handle(() => this.compose(this.take(handlerTypes[0]).inherit(current), 0, handlerTypes)())
        .finally(() => this.give(current));
    } else { // the last handler
      return async () => current.handle(current.run.bind(current))
        .finally(() => this.give(current));
    }
  }

}
