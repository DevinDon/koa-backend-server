import { Rester } from '../core/rester';
import { HandlerType } from '../decorators';
import { HTTPException } from '../exceptions';
import { BaseHandler } from './base.handler';

export interface ExceptionConfig {
  response: string;
}

export class ExceptionHandler extends BaseHandler {

  static init(rester: Rester): HandlerType {
    ExceptionHandler.config({
      trace: rester.config.logger.trace,
      response: JSON.stringify({ status: false }),
    });
    return ExceptionHandler;
  }

  private logger = this.rester.logger;

  async handle(next: () => Promise<any>): Promise<any> {

    return next()
      .catch((exception: HTTPException | Error) => {

        const trace = ExceptionHandler.configuration.trace;

        let returns;

        if (exception instanceof HTTPException) {
          // if it is HTTP Exception, set code & return the content
          this.logger
            .error(`HTTP ${exception.code} Exception from '${this.request.method} ${this.request.url}': ${exception.message}\t${exception.content ? JSON.stringify(exception.content) : ''}`);
          // if trace is true, output stack info
          if (trace) {
            this.logger.error(`Detail: ${exception.stack}`);
          }
          this.response.statusCode = exception.code;
          this.response.statusMessage = exception.message;
          returns = exception.content;
        } else {
          // else, just throw 500 with `ExceptionHandler.configuration.response`
          this.logger
            .error(`HTTP 500 Internal Exception from '${this.request.method} ${this.request.url}': ${exception.name} ${exception.message}`);
          // if trace is true, output stack info
          if (trace) {
            this.logger.error(`Detail: ${exception.stack}`);
          }
          this.response.statusCode = 500;
          this.response.statusMessage = exception.message;
          returns = ExceptionHandler.configuration.response;
        }

        // default to `application/json` header
        if (!this.response.getHeader('Content-Type')) {
          this.response.setHeader('Content-Type', 'application/json');
        }

        // stringify without schema
        return typeof returns === 'string'
          ? returns
          : JSON.stringify(returns);

      });

  }

}
