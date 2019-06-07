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
  }

  take(request: IncomingMessage, response: ServerResponse): BaseHandler {
    return (this.pool.pop() || new CoreHandler()).init(request, response);
  }

  give(handler: BaseHandler): number {
    return this.pool.length < this.max ? this.pool.push(handler) : 0;
  }

}
