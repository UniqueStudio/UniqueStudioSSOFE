import { defineStore } from 'pinia';
import type { ValidatedError } from '@arco-design/web-vue';
import { Message } from '@arco-design/web-vue';

import { sendValidateCode, ssoLogin } from '@/api';
import { LoginResponse } from '@/constants/httpMsg/register/LoginStatusMsg';
import i18n from '@/locale';

import router from '@/router';
import {
  ValidateCodeRequest,
  ValidateCodeResponse,
} from '@/constants/httpMsg/register/ValidateStatusMsg';
import { LoginMethod, LoginStore } from '../type';

export type validateAble = {
  validate: () => Promise<ValidatedError>;
};

const useLoginStore = defineStore('login', {
  state: (): LoginStore => ({
    loginFormInfo: {
      phoneNumber: '',
      validateCode: '',
      password: '',
      email: '',
    },
    loginMethod: LoginMethod.phone,
    isRegister: false,
    isSendValidateCode: false,
    buttonContent: i18n.global.t('register.getValidateCode'),
  }),
  actions: {
    setIsRegister(newVal: boolean) {
      this.isRegister = newVal;
    },
    async handleLogin(formRef: validateAble) {
      // console.log(formRef);
      const err = await formRef.validate();
      if (err) return;

      switch (this.loginMethod) {
        case LoginMethod.phone:
          {
            const oPostData = {
              phone: this.loginFormInfo.phoneNumber,
              password: this.loginFormInfo.password,
            };
            const res: Promise<LoginResponse> = ssoLogin(oPostData);
            res.then((response) => {
              if (response !== null) {
                const hr = 'hr2024.hustunique.com';
                const join = 'join2024.hustunique.com';
                Message.success(i18n.global.t('login.success'));
                const from = new URLSearchParams(window.location.search).get(
                  'from',
                );
                if (from) {
                  if (from === hr || from === join)
                    window.location.href = `https://${from}`;
                  else router.push('/user/edit-info');
                } else router.push('/user/edit-info');
                // window.location.href = `https://5173.hustunique.com`;
              }
            });
          }
          break;
        case LoginMethod.sms:
          {
            const oPostData = {
              phone: this.loginFormInfo.phoneNumber,
              validate_code: this.loginFormInfo.validateCode,
            };
            const res: Promise<LoginResponse> = ssoLogin(oPostData);
            res.then((response) => {
              if (response !== null) {
                const hr = 'hr2024.hustunique.com';
                const join = 'join2024.hustunique.com';
                Message.success(i18n.global.t('login.success'));
                const from = new URLSearchParams(window.location.search).get(
                  'from',
                );
                if (from) {
                  if (from === hr || from === join)
                    window.location.href = `https://${from}`;
                  else router.push('/user/edit-info');
                } else router.push('/user/edit-info');
                // window.location.href = `https://5173.hustunique.com`;
              }
            });
          }
          break;
        case LoginMethod.email:
          {
            const oPostData = {
              email: this.loginFormInfo.email,
              password: this.loginFormInfo.password,
            };
            const res: Promise<LoginResponse> = ssoLogin(oPostData);
            res.then((response) => {
              if (response !== null) {
                const hr = 'hr2024.hustunique.com';
                const join = 'join2024.hustunique.com';
                Message.success(i18n.global.t('login.success'));
                const from = new URLSearchParams(window.location.search).get(
                  'from',
                );
                if (from) {
                  if (from === hr || from === join)
                    window.location.href = `https://${from}`;
                  else router.push('/user/edit-info');
                } else router.push('/user/edit-info');
                // window.location.href = `https://5173.hustunique.com`;
              }
            });
          }
          break;
        default:
          // eslint-disable-next-line no-console
          console.error('不存在的loginMethod:', this.loginMethod);
          break;
      }
    },
    handleValidateCode(loginFormRef: any) {
      loginFormRef
        .validateField('phoneNumber')
        .then((ValidatedError: ValidatedError) => {
          if (ValidatedError) {
            return;
          }

          const oPostData: ValidateCodeRequest = {
            phone: this.loginFormInfo.phoneNumber,
          };
          const res: Promise<ValidateCodeResponse> =
            sendValidateCode(oPostData);
          res.then((response) => {
            if (response !== null) {
              Message.success(
                i18n.global.t('register.getValidateCode.success'),
              );
            }
          });
          this.isSendValidateCode = true;

          let countDown: number = 60;
          const timeInterval = setInterval(() => {
            countDown -= 1;
            if (countDown > 0) {
              this.buttonContent = String(countDown);
            } else {
              this.buttonContent = i18n.global.t('register.getValidateCode');
              this.isSendValidateCode = false;
              clearInterval(timeInterval);
            }
          }, 1000);
        });
    },
  },
});

export default useLoginStore;
