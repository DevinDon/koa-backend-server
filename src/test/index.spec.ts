import 'reflect-metadata';
import { logger } from '@iinfinity/logger';

describe('index', () => {

  it('should say hello', done => {
    logger.log('Hello, world!');
    done();
  });

});
