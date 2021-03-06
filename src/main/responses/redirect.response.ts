import { BaseResponse, Response } from './base.response';

export type RedirectResponseConfig = Partial<Response> & {
  url: string;
  temporarily?: boolean;
}

export class RedirectResponse extends BaseResponse<string> {

  constructor({ url, temporarily, ...rest }: RedirectResponseConfig) {
    super(rest as any);
    this.headers.location = url;
    this.statusCode = temporarily ? 302 : 301;
    this.statusMessage = temporarily ? 'Moved Temporarily' : 'Move Permanently';
  }

}
