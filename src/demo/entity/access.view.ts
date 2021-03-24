import { getEntity, Pagination } from '@rester/orm';
import { IncomingMessage, ServerResponse } from 'http';
import { BaseView, GET, HTTPRequest, HTTPResponse, parseIPsFromRequest, PathQuery, PathVariable, View } from '../../main';
import { AccessEntity } from './access.entity';
import { Access } from './access.model';

@View()
export class AccessView extends BaseView {

  private entity: AccessEntity;
  private collection: AccessEntity['collection'];

  async init() {
    this.entity = getEntity(AccessEntity);
    this.collection = this.entity.collection;
  }

  @GET()
  async all(
    @PathQuery('from') from: string = '000000000000000000000000',
    @PathQuery('take') take: number = 10,
  ): Promise<Pagination<string, Access>> {
    return this.entity.getPagination({ from, take });
  }

  @GET(':path')
  async access(
    @HTTPRequest() request: IncomingMessage,
    @HTTPResponse() response: ServerResponse,
    @PathVariable('path') path: string,
    @PathQuery() query: any,
  ) {
    const result = await this.collection.insertOne({
      method: request.method?.toUpperCase() || 'UNKNOWN',
      path,
      query,
      headers: request.headers,
      timestamp: new Date(),
      ips: parseIPsFromRequest(request),
      version: request.httpVersion,
      statusCode: response.statusCode,
      statusMessage: response.statusMessage,
      length: 0,
    });
    return this.collection.findOne({ _id: result.insertedId });
  }

}
