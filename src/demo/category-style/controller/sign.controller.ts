import { Controller } from '../../../main';
import { User, UserEntity } from '../entity';

@Controller()
export class SignController {

  async signCheck(email: string): Promise<User | undefined> {
    return UserEntity.findOne({ email });
  }

  async signIn(user: Pick<User, 'email' | 'password'>): Promise<User | undefined> {
    return UserEntity.findOne(user);
  }

  signOut() {
    return true;
  }

  async signUp(user: Pick<User, 'email' | 'password'>): Promise<User | undefined> {
    const exist = await UserEntity.findOne(user);
    if (!exist) {
      const result = await UserEntity.insert(user);
      if (result.identifiers[0]) {
        return { id: result.identifiers[0].id, email: user.email, password: user.password };
      }
    }
  }

}
