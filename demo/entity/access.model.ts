import { ObjectID } from '@rester/orm';
import { IncomingHttpHeaders } from 'http';

export interface Access {

  _id?: ObjectID;

  method: string;

  path: string;

  query?: string;

  headers: IncomingHttpHeaders;

  timestamp: Date;

  ips: string[];

  version: string;

  statusCode: number;

  statusMessage: string;

  length: number;

}
