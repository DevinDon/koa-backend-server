import { Logger } from '@rester/logger';
import { Rester } from './rester';

export class BaseController {

  protected rester!: Rester;

  protected logger!: Logger;

  async init(): Promise<void> { }

}
