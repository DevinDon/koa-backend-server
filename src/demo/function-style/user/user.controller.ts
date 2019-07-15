import { Controller } from '../../../main';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {

  async increase(id: number) {
    await UserEntity.createQueryBuilder()
      .update()
      .set({ total: () => '"total" + 1' })
      .where('id = :id', { id })
      .execute();
    return UserEntity.findOne(id);
  }

}
