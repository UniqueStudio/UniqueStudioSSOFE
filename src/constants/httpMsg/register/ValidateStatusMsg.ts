import { HttpRes } from '../_httpResTemplate';

export interface ValidateCodeRequest {
  phone: string;
  email: string;
}

export type ValidateCodeResponse = HttpRes<{
  message: string;
  data: string;
}>;
