import { BaseModel } from './base.model';

export interface SignUpContent {
  username: string;
  password: string;
}

export type SignUpModel = BaseModel<SignUpContent>;
