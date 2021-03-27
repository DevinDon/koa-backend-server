import 'reflect-metadata';
import { logger } from '@rester/logger';

describe('index', () => {

  it('should say hello', done => {
    logger.log('Hello, world!');
    done();
  });

});
