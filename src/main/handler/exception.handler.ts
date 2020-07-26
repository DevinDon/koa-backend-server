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

  handle(next: () => Promise<any>): Promise<any> {

    return next()
      .catch((exception: HTTPException | Error) => {

        let returns;

        if (exception instanceof HTTPException) {
          // if it is HTTP Exception, set code & return the content
          this.rester.configLogger.get()
            .error(`HTTP ${exception.code} Exception: ${exception.message}\t${JSON.stringify(exception.content ?? '')}`);
          // if debug is true, output stack info
          if (this.rester.zone.config.debug) {
            this.rester.configLogger.get().error(`${exception.stack}`);
          }
          this.response.statusCode = exception.code;
          this.response.statusMessage = exception.message;
          returns = exception.content;
        } else {
          // else, just throw 500 with `zone.exception.response` or `{}`
          this.rester.configLogger.get()
            .error(`Internal Exception: ${exception.name} ${exception.message}`);
          // if debug is true, output stack info
          if (this.rester.zone.config.debug) {
            this.rester.configLogger.get().error(`${exception.stack}`);
          }
          this.response.statusCode = 500;
          this.response.statusMessage = exception.message;
          returns = this.rester.zone.exception?.response || {};
        }

        return typeof returns === 'string'
          ? returns
          : JSON.stringify(returns);

      });

  }

}
