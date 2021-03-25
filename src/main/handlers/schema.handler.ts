import { Stream } from 'stream';
import { ContentType, CONTENT_TYPE } from '../constants';
import { ResterResponse } from '../responses';
import { BufferStream } from '../utils';
import { BaseHandler } from './base.handler';

/**
 * Schema handler, draft.
 *
 * @extends BaseHandler
 */
export class SchemaHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    return next()
      .then(
        value => {

          // value is object, should be stringify or boldify
          if (typeof value === 'object') {

            // value is a rester response
            if (value instanceof ResterResponse) {
              for (const key in value.headers) {
                if (Object.prototype.hasOwnProperty.call(value.headers, key)) {
                  this.response.setHeader(key, value.headers[key]);
                }
              }
              this.response.statusCode = value.statusCode;
              this.response.statusMessage = value.statusMessage;
              value = value.data;
              // not return, keep going
            }

            // value is buffer
            if (value instanceof Buffer) {
              this.response.hasHeader(CONTENT_TYPE) || this.response.setHeader(CONTENT_TYPE, ContentType.STREAM);
              // TODO: Buffer is binary, base64 or something else
              return new BufferStream(value);
            }

            // value is stream
            if (value instanceof Stream) {
              return value;
            }

            // else json.stringify
            this.response.hasHeader(CONTENT_TYPE) || this.response.setHeader(CONTENT_TYPE, ContentType.JSON);
            // TODO: JSON schema
            return JSON.stringify(value);

          }

          // value is undefined or null, return empty string
          if (value === undefined || value === null) {
            return '';
          }

          // value is string, return string
          if (typeof value === 'string') {
            this.response.hasHeader(CONTENT_TYPE) || this.response.setHeader(CONTENT_TYPE, ContentType.TEXT);
            return value;
          }

          // or just return
          return value;

        },
      );
  }

}
