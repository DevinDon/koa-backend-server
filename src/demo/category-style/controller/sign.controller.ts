import { Controller, CORSHandler, GET, Handler, Inject, PathVariable, POST, RequestBody, OPTIONS } from '../../../main';
import { BaseResponse, SignInRequest, SignInResponse, SignOutRequest, SignOutResponse, SignUpRequest, SignUpResponse } from '../model';
import { SignService } from '../service/sign.service';

@Controller('/sign')
@Handler(CORSHandler)
export class SignController {

  @Inject()
  private service!: SignService;

  @GET('/check/{{email}}')
  async signCheck(@PathVariable('email') email: string): Promise<BaseResponse> {
    const result = await this.service.signCheck(email);
    if (result) {
      return { status: true };
    } else {
      return { status: false };
    }
  }

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

  @GET('/test')
  @GET('/test/{{id}}')
  test() {
    return { OK: 'Test' };
  }

}
