import { Controller, POST, RequestBody, Inject, Handler, OPTIONS, GET, PathVariable } from '../../../main';
import { SignInRequest, SignInResponse, SignOutRequest, SignOutResponse, SignUpRequest, SignUpResponse, BaseResponse } from '../model';
import { SignService } from '../service';
import { CORSHandler } from '../handler/cors.handler';

@Controller('/sign')
@Handler(CORSHandler)
export class SignController {

  @Inject()
  private service!: SignService;

  @OPTIONS('/check/{{email}}')
  signCheckOption() {
    return '';
  }

  @GET('/check/{{email}}')
  async signCheck(@PathVariable('email') email: string): Promise<BaseResponse> {
    const result = await this.service.signCheck(email);
    if (result) {
      return { status: true };
    } else {
      return { status: false };
    }
  }

  @OPTIONS('/in')
  signInOption() {
    return '';
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

  @OPTIONS('/out')
  signOutOption() {
    return '';
  }

  @POST('/out')
  async signOut(@RequestBody() body: SignOutRequest): Promise<SignOutResponse> {
    return { status: await this.service.signOut() };
  }

  @OPTIONS('/up')
  signUpOption() {
    return '';
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
