import { IncomingMessage, ServerResponse } from 'http';

export abstract class BaseHandler {

  protected request?: IncomingMessage;
  protected response?: ServerResponse;

  init(request?: IncomingMessage, response?: ServerResponse): this {
    this.request = request;
    this.response = response;
    return this;
  }

  abstract handle(): string;

}
