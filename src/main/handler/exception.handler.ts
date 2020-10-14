import { HandlerType } from '../decorator';
import { HTTPException } from '../exception';
import { Rester } from '../rester';
import { BaseHandler } from './base.handler';

export interface ExceptionConfig {
  response: string;
}

export class ExceptionHandler extends BaseHandler {

  static config(rester: Rester, config?: ExceptionConfig): HandlerType {
    rester.zone.exception = config || { response: JSON.stringify({ status: false }) };
    return ExceptionHandler;
  }

  static init(rester: Rester, config?: any): HandlerType {
    ExceptionHandler.config(rester, config);
    return ExceptionHandler;
  }

  private logger = this.rester.configLogger.get();

  async handle(next: () => Promise<any>): Promise<any> {

    return next()
      .catch((exception: HTTPException | Error) => {

        let returns;
        const debug = this.rester.zone.config?.debug;

        if (exception instanceof HTTPException) {
          // if it is HTTP Exception, set code & return the content
          this.logger
            .error(`HTTP ${exception.code} Exception from '${this.request.method} ${this.request.url}': ${exception.message}\t${exception.content ? JSON.stringify(exception.content) : ''}`);
          // if debug is true, output stack info
          if (debug) {
            this.logger.error(`Detail: ${exception.stack}`);
          }
          this.response.statusCode = exception.code;
          this.response.statusMessage = exception.message;
          returns = exception.content;
        } else {
          // else, just throw 500 with `zone.exception.response` or `{}`
          this.logger
            .error(`HTTP 500 Internal Exception from '${this.request.method} ${this.request.url}': ${exception.name} ${exception.message}`);
          // if debug is true, output stack info
          if (debug) {
            this.logger.error(`Detail: ${exception.stack}`);
          }
          this.response.statusCode = 500;
          this.response.statusMessage = exception.message;
          returns = this.rester.zone.exception?.response || {};
        }

        if (!this.response.getHeader('Content-Type')) {
          this.response.setHeader('Content-Type', 'application/json');
        }

        return typeof returns === 'string'
          ? returns
          : JSON.stringify(returns);

      });

  }

}
