import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import { HttpRes } from '@/constants/httpMsg/_httpResTemplate';
import { Message } from '@arco-design/web-vue';
import i18n from '@/locale';
import { SERVER_BASE_URL } from '@/constants';

// const { t } = useI18n();

export default function request<T = object>(config: AxiosRequestConfig) {
  const instance: AxiosInstance = axios.create({
    baseURL: SERVER_BASE_URL,
    timeout: 60000,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (
      internalConfig: InternalAxiosRequestConfig,
    ): InternalAxiosRequestConfig => {
      return internalConfig;
    },
    (err: any): any => {
      console.error(err);
      Message.error(err.message);
    },
  );

  instance.interceptors.response.use(
    // 这一部分没按响应拦截器的标准ts类型来，待优化。
    (response) => {
      // data的类型是 HttpRes
      const data = response.data || {};
      if (response.status === 200) {
        return data;
      }
      if (data.message) {
        // 使用直接对象查表来处理包含特殊字符（如引号、括号）的复杂后端错误信息
        const locale = (i18n.global.locale as any).value || i18n.global.locale;
        const messages =
          (i18n.global.messages as any).value || i18n.global.messages;
        const backendMap = messages[locale]?.backend || {};
        const translated =
          backendMap[data.message] || i18n.global.t(`backend.${data.message}`);

        Message.error(
          translated === `backend.${data.message}` ? data.message : translated,
        );
      } else {
        console.error('# error', { response });
        Message.error(i18n.global.t('request.unknowErr'));
      }
      return null;
    },
    (err: any): any => {
      console.error(err);
      if (err.response.data.message) {
        const locale = (i18n.global.locale as any).value || i18n.global.locale;
        const messages =
          (i18n.global.messages as any).value || i18n.global.messages;
        const backendMap = messages[locale]?.backend || {};
        const translated =
          backendMap[err.response.data.message] ||
          i18n.global.t(`backend.${err.response.data.message}`);

        Message.error(
          translated === `backend.${err.response.data.message}`
            ? err.response.data.message
            : translated,
        );
      } else {
        Message.error(err.message);
      }
      return null;
    },
  );

  return instance(config) as Promise<HttpRes<T>>;
}
