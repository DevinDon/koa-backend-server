import { BaseResponse } from './base.response';

export interface RedirectResponseConfig {
  url: string;
  temporarily: boolean;
}

export class RedirectResponse extends BaseResponse<string> {

  constructor({ url, temporarily }: RedirectResponseConfig) {
    super({
      data: undefined as any,
      headers: { location: url },
      statusCode: temporarily ? 302 : 301,
      statusMessage: temporarily ? 'Moved Temporarily' : 'Move Permanently',
    });
  }

}
