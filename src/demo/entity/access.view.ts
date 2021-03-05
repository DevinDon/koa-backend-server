import { IncomingMessage } from 'http';
import { GET, HTTPRequest, PathQuery, View } from '../../main';
import { AccessEntity } from './access.entity';

@View()
export class AccessView {

  @GET()
  async all() {
    return AccessEntity.find({ order: { id: 'DESC' } });
  }

  @GET(':path')
  async access(
    @HTTPRequest() request: IncomingMessage,
    @PathQuery() query: any,
  ) {
    const result = await AccessEntity.insert({
      method: request.method?.toUpperCase(),
      url: request.url,
      params: JSON.stringify(query),
      datetime: new Date(),
      ip: request.headers['x-forwarded-for'] as string || request.socket.remoteAddress || '1.1.1.1',
    });
    return AccessEntity.findOne(result.identifiers[0]);
  }

}
