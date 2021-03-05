import { logger } from '@iinfinity/logger';
import { Controller, GET, Inject, PathVariable, Rester, View } from '../../main';
import { ContentType, CONTENT_TYPE } from '../../main/constants';
import { BaseResponse } from '../../main/responses/base.response';

@Controller()
class SimpleController {

  init() {
    logger.log('I\'m OK!');
  }

  echo(text: string) {
    return text;
  }

}

@View()
class SimpleView {

  @Inject()
  private controller!: SimpleController;

  @GET()
  index() {
    return 'Hello, world!';
  }

  @GET('echo/:text')
  echo(
    @PathVariable('text') text: string = '',
  ) {
    return this.controller.echo(text);
  }

  @GET('header')
  header() {
    return new BaseResponse({
      headers: {
        [CONTENT_TYPE]: ContentType.TEXT,
        'x-test-header': 'test-header',
      },
      data: { hello: 'world' },
    });
  }

}

const rester = new Rester();

rester.bootstrap(`Rester startup at ${new Date().toISOString()}`);
