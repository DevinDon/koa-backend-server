import { BaseHandler } from './base.handler';

/**
 * Schema handler, draft.
 *
 * @extends BaseHandler
 */
export class SchemaHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    return next()
      .then(v => {
        if (typeof v === 'undefined') {
          return '';
        } else if (typeof v === 'object') {
          if (v instanceof Buffer) {
            // content-type should be application/json when v is an object & not instanceof Buffer
            this.response.setHeader('content-type', 'application/octet-stream');
            // TODO: Buffer is binary, base64 or something else
            return v;
          } else {
            // content-type should be application/json when v is an object & not instanceof Buffer
            this.response.setHeader('content-type', 'application/json');
            // TODO: JSON schema
            return JSON.stringify(v);
          }
        } else if (typeof v === 'string') {
          // content-type should be text/plain when v is an string
          this.response.setHeader('content-type', 'text/plain');
          return v;
        } else {
          // content-type should be text/plain when v is other type
          // like boolean, number, and so on
          this.response.setHeader('content-type', 'text/plain');
          return String(v);
        }
      });
  }

}
