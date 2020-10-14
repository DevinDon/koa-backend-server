import { CORSHandler, GET, Handler, Inject, PathVariable, POST, RequestBody, View } from '../../../main';
import { SignController } from '../controller/sign.controller';
import { BaseResponse, SignInRequest, SignInResponse, SignOutRequest, SignOutResponse, SignUpRequest, SignUpResponse } from '../model';

@View('/sign')
@Handler(CORSHandler)
export class SignView {

  @Inject()
  private controller!: SignController;

  @GET('/check/:email')
  async signCheck(@PathVariable('email') email: string): Promise<BaseResponse> {
    const result = await this.controller.signCheck(email);
    if (result) {
      return { status: true };
    } else {
      return { status: false };
    }
  }

  @POST('/in')
  async signIn(@RequestBody() body: SignInRequest): Promise<SignInResponse> {
    const result = await this.controller.signIn(body);
    if (result) {
      return { status: true, content: { email: result.email, nickname: result.nickname } };
    } else {
      return { status: false };
    }
  }

  @POST('/out')
  async signOut(@RequestBody() body: SignOutRequest): Promise<SignOutResponse> {
    return { status: await this.controller.signOut() };
  }

  @POST('/up')
  async signUp(@RequestBody() body: SignUpRequest): Promise<SignUpResponse> {
    const result = await this.controller.signUp(body);
    if (result) {
      return { status: true, content: result };
    } else {
      return { status: false };
    }
  }

  @GET('/test')
  @GET('/test/:id')
  test() {
    return { OK: 'Test' };
  }

}
