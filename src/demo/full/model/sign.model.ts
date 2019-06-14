import { User } from '../entity';
import { BaseRequest, BaseResponse } from './base.model';

export type SignInRequest = Pick<User, 'email' | 'password'>;

export type SignInResponse = BaseResponse<Pick<User, 'email' | 'nickname'>>;

export type SignUpRequest = SignInRequest;

export type SignUpResponse = BaseResponse<User>;

export type SignOutRequest = BaseRequest;

export type SignOutResponse = BaseResponse;
