import { BaseHandler } from '../../../main';

interface CORS {
  'Access-Control-Allow-Origin': 'http://foo.example';
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS';
  'Access-Control-Allow-Headers': 'X-PINGOTHER, Content-Type';
  'Access-Control-Max-Age': number;
}

export class CORSHandler extends BaseHandler {

  handle(next: () => Promise<any>): Promise<any> {
    this.response.setHeader('Access-Control-Allow-Origin', '*');
    this.response.setHeader('Access-Control-Allow-Methods', '*');
    this.response.setHeader('Access-Control-Allow-Headers', '*');
    this.response.setHeader('Access-Control-Max-Age', 86400);
    return next();
  }

}
