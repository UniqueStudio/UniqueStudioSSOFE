export const enum LoginMethod {
  phone = 1,
  sms = 2,
  email = 3,
}

export const enum Gender {
  male = 1,
  female = 2,
  other = 3,
}

export interface LoginFormInfo {
  phoneNumber: string;
  validateCode: string;
  password: string;
  email: string;
}

export interface LoginStore {
  loginFormInfo: LoginFormInfo;
  loginMethod: LoginMethod;
  isRegister: boolean;
  isSendValidateCode: boolean;
  buttonContent: string;
}

export interface RegisterFormInfo {
  name: string;
  gender: Gender | null;
  phoneNumber: string;
  password: string;
  validateCode: string;
  email: string;
}

export interface RegisterStore {
  registerFormInfo: RegisterFormInfo;
  isSendValidateCode: boolean;
  buttonContent: string;
}
