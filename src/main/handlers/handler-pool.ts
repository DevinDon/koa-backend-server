import { IncomingMessage, ServerResponse } from 'http';
import { pipeline, Readable } from 'stream';
import { Rester } from '../core/rester';
import { HandlerType } from '../decorators';
import { pipelines, writes } from '../utils';
import { BaseHandler } from './base.handler';

/**
 * Handler pool.
 */
export class HandlerPool {

  /** Maximum number of handlers per category, default to 1024. */
  private max: number;
  /** Pools. */
  private pools: Map<string, BaseHandler[]> = new Map();

  /**
   * Create a new handler pool.
   *
   * @param rester The rester instance to which this handler belongs.
   */
  constructor(private rester: Rester) {
    this.max = rester.config.handlerPool.max ?? 1024;
  }

  /**
   * Take one hander instance with special type.
   *
   * @param {HandlerType} handler Handler type.
   * @returns {T} A handler instance with special type.
   */
  take<T = BaseHandler>(handler: HandlerType): T {
    const pool = this.pools.get(handler.name) || this.pools.set(handler.name, []).get(handler.name)!;
    return pool.pop() || new handler(this.rester) as any;
  }

  /**
   * Give back this handler to pool.
   *
   * @param {BaseHandler} handler Handler instance.
   * @returns {number} Number of handlers in pool.
   */
  give(handler: BaseHandler): number {
    const pool = this.pools.has(handler.constructor.name)
      ? this.pools.get(handler.constructor.name)!
      : this.pools.set(handler.constructor.name, []).get(handler.constructor.name)!;
    return pool.length < this.max ? pool.push(handler.from()) : pool.length;
  }

  /**
   * Process request & response in HTTP/S/2 server.
   *
   * @param {IncomingMessage} request Request.
   * @param {ServerResponse} response Response.
   */
  async process(request: IncomingMessage, response: ServerResponse): Promise<void> {
    // take & compose these handlers
    this.compose(this.take(this.rester.handlers[0]).from(request, response), 0, this.rester.handlers)()
      .then(
        value => value && value instanceof Readable
          ? pipelines(value, response)
          : writes(value, response),
      )
      .catch(reason => this.rester.logger.trace('Error while compose:', reason))
      .finally(() => response.end());
  }

  /**
   * Compose all handler.
   *
   * @param {THandler extends BaseHandler} current Current handler instance.
   * @param {number} i Index of handler types in this request.
   * @param {HandlerType[]} handlers Handler types in this request.
   * @returns {() => Promise<any>} Composed function.
   */
  compose(current: BaseHandler, i: number, handlers: HandlerType[]): () => Promise<any> {
    // 根据 handlers 的数量进行组合 compose
    if (i + 1 < handlers.length) {
      // that is very very very, complex
      // 利用非立即执行函数的特性, 在 current.handle 调用 next 时再进行数据继承绑定
      // 才能正确的获取所有的属性（包括参数和已处理过的其他属性）
      // by the way, it will also make compose faster than before
      return async () => current.handle(
        () => this.compose(this.take(handlers[++i]).inherit(current), i, handlers)(),
      ).finally(() => this.give(current));
    } else if (handlers === this.rester.handlers && current.route?.handlers.length) {
      // global handlers has been composed, and handler.route.HandlerTypes should exist
      handlers = current.route.handlers;
      return async () => current.handle(() => this.compose(this.take(handlers[0]).inherit(current), 0, handlers)())
        .finally(() => this.give(current));
    } else {
      // the last handler
      return async () => current.handle(current.run.bind(current))
        .finally(() => this.give(current));
    }
  }

}
