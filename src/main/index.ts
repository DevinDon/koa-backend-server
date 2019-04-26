import { Logger } from '@iinfinity/logger';
import 'koa-body';

export const logger = new Logger('Rester');
export * from './@types';
export * from './middleware';
export * from './Rester';
