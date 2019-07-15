import { Inject, PATCH, View } from '../../../main';
import { UserController } from './user.controller';

@View('/')
export class UserView {

  @Inject()
  private controller!: UserController;

  @PATCH('/')
  async increase() {
    const result = await this.controller.increase(1);
    console.log(result);
    return result;
  }

}
