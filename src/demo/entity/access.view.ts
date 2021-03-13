import { IncomingMessage } from 'http';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { BaseView, GET, getPagination, HTTPRequest, Pagination, PathQuery, View } from '../../main';
import { AccessEntity } from './access.entity';

@View()
export class AccessView extends BaseView {

  private repo!: MongoRepository<AccessEntity>;

  async init() {
    this.repo = getMongoRepository(AccessEntity);
  }

  @GET()
  async all(
    @PathQuery('from') from: string = '000000000000000000000000',
    @PathQuery('take') take: number = 10,
  ): Promise<Pagination<string, AccessEntity>> {
    return getPagination(this.repo, { from, take });
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
    // return AccessEntity.findOne(result.identifiers[0]);
    return result;
  }

}
