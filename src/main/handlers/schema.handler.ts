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
            // Content-Type should be application/json when v is an object & not instanceof Buffer
            if (!this.response.getHeader('Content-Type')) {
              this.response.setHeader('Content-Type', 'application/octet-stream');
            }
            // TODO: Buffer is binary, base64 or something else
            return v;
          } else {
            // Content-Type should be application/json when v is an object & not instanceof Buffer
            if (!this.response.getHeader('Content-Type')) {
              this.response.setHeader('Content-Type', 'application/json');
            }
            // TODO: JSON schema
            return JSON.stringify(v);
          }
        } else if (typeof v === 'string') {
          // Content-Type should be text/plain when v is an string
          if (!this.response.getHeader('Content-Type')) {
            this.response.setHeader('Content-Type', 'text/plain');
          }
          return v;
        } else {
          // Content-Type should be text/plain when v is other type
          // like boolean, number, and so on
          if (!this.response.getHeader('Content-Type')) {
            this.response.setHeader('Content-Type', 'text/plain');
          }
          return String(v);
        }
      });
  }

}
