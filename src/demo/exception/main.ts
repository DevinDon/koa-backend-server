import { GET, HTTP400Exception, HTTP401Exception, HTTP404Exception, HTTP418Exception, HTTPException, PathVariable, Rester, View } from '../../main';

@View()
class ExceptionView {

  @GET('400')
  e400() {
    throw new HTTP400Exception('Bad Request with custom message', { content: 'tips here' });
  }

  @GET('401')
  e401() {
    throw new HTTP401Exception('Unauthorized with custom message', { content: 'tips here' });
  }

  @GET('404')
  e404() {
    throw new HTTP404Exception('Not Found with custom message', { content: 'tips here' });
  }

  @GET('418')
  e418() {
    throw new HTTP418Exception('I am a teapot with custom message', { content: 'tips here' });
  }

  @GET('500')
  e500() {
    throw new Error('Some internal error with 500');
  }

  @GET(':code')
  e599(@PathVariable('code') code: number) {
    throw new HTTPException(+code);
  }

}

const rester = new Rester();

rester.bootstrap();
