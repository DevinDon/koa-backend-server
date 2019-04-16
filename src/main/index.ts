import { Logger } from '@iinfinity/logger';

export const logger = new Logger('Rester');

import 'koa-body';
export * from './@types';
export * from './database';
export * from './middleware';
export * from './Rester';
