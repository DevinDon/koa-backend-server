import { ResterResponse, ResponseConfig } from './rester.response';

export type RedirectResponseConfig = Partial<ResponseConfig> & {
  url: string;
  temporarily?: boolean;
}

export class RedirectResponse extends ResterResponse<string> {

  constructor({ url, temporarily, ...rest }: RedirectResponseConfig) {
    super(rest as any);
    this.headers['location'] = url;
    this.statusCode = temporarily ? 302 : 301;
    this.statusMessage = temporarily ? 'Moved Temporarily' : 'Move Permanently';
  }

}
