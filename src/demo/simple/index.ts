import { logger } from '@iinfinity/logger';
import { Controller, GET, Inject, PathVariable, Rester, View } from '../../main';

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
    @PathVariable('text') text: string = ''
  ) {
    return this.controller.echo(text);
  }

}

const server = new Rester()
  .configAddress.setHost('0.0.0.0').end()
  .configViews.add(SimpleView).end()
  .listen();
