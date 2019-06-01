import { Logger } from '@iinfinity/logger';
import 'reflect-metadata';

export const logger = new Logger('Rester');
export * from './@types';
export * from './decorator';
export * from './handler';
export * from './Rester';
