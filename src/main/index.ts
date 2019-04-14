import Logger from '@iinfinity/logger';
import 'koa-body';

export const logger = new Logger('Rester');

export * from './@types';
export * from './database';
export * from './middleware';
