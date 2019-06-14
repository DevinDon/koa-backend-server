import { Controller, POST, RequestBody, Inject } from '../../../main';
import { SignInRequest, SignInResponse, SignOutRequest, SignOutResponse, SignUpRequest, SignUpResponse } from '../model';
import { SignService } from '../service';

@Controller('/sign')
export class SignController {

  @Inject()
  private service!: SignService;

  @POST('/in')
  async signIn(@RequestBody() body: SignInRequest): Promise<SignInResponse> {
    const result = await this.service.signIn(body);
    if (result) {
      return { status: true, content: { email: result.email, nickname: result.nickname } };
    } else {
      return { status: false };
    }
  }

  @POST('/out')
  async signOut(@RequestBody() body: SignOutRequest): Promise<SignOutResponse> {
    return { status: await this.service.signOut() };
  }

  @POST('/up')
  async signUp(@RequestBody() body: SignUpRequest): Promise<SignUpResponse> {
    const result = await this.service.signUp(body);
    if (result) {
      return { status: true, content: result };
    } else {
      return { status: false };
    }
  }

}
