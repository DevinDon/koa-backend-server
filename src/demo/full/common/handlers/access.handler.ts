import { getRepository } from 'typeorm';
import { BaseHandler } from '../../../../main';
import { AccessEntity } from '../../access';

export class AccessHandler extends BaseHandler {

  async handle(next: () => Promise<any>): Promise<any> {
    getRepository(AccessEntity, 'local').insert({
      method: this.request.method?.toUpperCase(),
      url: this.request.url,
      params: JSON.stringify(this.mapping.queryObject),
      datetime: new Date(),
      ip: this.request.headers['x-forwarded-for'] as string || this.request.socket.remoteAddress || '1.1.1.1',
    });
    return next();
  }

}
