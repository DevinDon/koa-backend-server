import { Rester } from '../core';
import { HandlerType } from '../decorators';
import { BaseHandler } from '../handlers/base.handler';

export class LoggerHandler extends BaseHandler {

  static trace: boolean = false;

  private logger = this.rester.logger;

  /**
   * Config & init handler.
   *
   * @param {Rester} rester Rester instance.
   * @returns {HandlerType} Handler class.
   */
  static init(rester: Rester): HandlerType {
    LoggerHandler.configuration.trace = rester.config.logger.trace;
    return this;
  }

  async handle(next: () => Promise<any>): Promise<any> {
    this.logger.debug(`${this.mapping.method} ${this.mapping.path} ${this.mapping.query || ''}`);
    return next().catch(exception => LoggerHandler.configuration.trace && this.logger.error(exception));
  }

}
