import { Logger } from '@iinfinity/logger';
import 'koa-body';
import 'reflect-metadata';

export const logger = new Logger('Rester');
export * from './@types';
export * from './decorator';
export * from './guard';
export * from './model';
export * from './Rester';
export * from './service';
