import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import type { ValidatedError } from '@arco-design/web-vue';
import { Message } from '@arco-design/web-vue';
import type {
  EditRequest,
  EditResponse,
} from '@/constants/httpMsg/register/EditStatusMsg';

import type {
  getInfoResponse,
  InfoData,
} from '@/constants/httpMsg/register/InfoStatusMsg';

import { edit, permission } from '@/api';
import { getInfo } from '@/api/getInfo';

import i18n from '@/locale';

import router from '@/router';
import {
  PermissionRequest,
  PermissionResponse,
} from '@/constants/httpMsg/register/PermissionMsg';
import type { EditFormInfo, UserInfo, PermissionFormInfo } from '../type';

const useEditStore = defineStore('edit', () => {
  // State
  const editFormInfo = reactive<EditFormInfo>({
    name: '',
    gender: null,
    password: '',
    email: '',
  });

  const userInfo = reactive<UserInfo>({
    name: '',
    gender: 0,
    phoneNumber: '',
    email: '',
    roles: [],
    groups: [],
  });
  const avatarName = computed(() => userInfo.name.slice(0, 1));

  const permissionFormInfo = reactive<PermissionFormInfo>({
    phone: '',
    joinTime: '',
    group: '',
    role: '',
  });

  // Actions
  function handleEdit(editFormRef: any) {
    editFormRef.validate().then((ValidatedError: ValidatedError) => {
      if (ValidatedError) {
        return;
      }

      const oPostData: EditRequest = {};

      const optionalSet = (key: keyof EditRequest) => {
        if (!editFormInfo[key]) return;

        if (key === 'password') {
          oPostData.password = editFormInfo.password;
          return;
        }

        if (editFormInfo[key] !== userInfo[key]) {
          oPostData[key] = editFormInfo[key] as any;
        }
      };

      (Object.keys(editFormInfo) as (keyof EditRequest)[]).forEach(optionalSet);

      const res: Promise<EditResponse> = edit(oPostData);
      res.then((response) => {
        if (response !== null) {
          Message.success(i18n.global.t('edit.success'));
          router.push('/user/edit-info').then(() => {
            router.go(0);
          });
        }
      });
    });
  }

  function handlePermission(data: PermissionRequest) {
    const res: Promise<PermissionResponse> = permission(data);
    res.then((response) => {
      if (response !== null) {
        Message.success(`${i18n.global.t('edit.success')}:${data.phone}`);
        router.push('/user/edit-info').then(() => {
          router.go(0);
        });
      }
    });
  }

  function getUserInfo(): Promise<InfoData> {
    return new Promise((resolve) => {
      const res: Promise<getInfoResponse> = getInfo();
      res
        .then((response) => {
          if (response !== null) {
            // 设置到 store 的 userInfo
            userInfo.name = response.data.name;
            userInfo.gender = response.data.gender;
            userInfo.phoneNumber = response.data.phone;
            userInfo.email = response.data.email;
            userInfo.roles = response.data.roles;
            userInfo.groups = response.data.groups;

            editFormInfo.name = userInfo.name;
            editFormInfo.gender = userInfo.gender;
            editFormInfo.email = userInfo.email;

            resolve(response.data);
          }
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log('error');
        });
    });
  }

  // 初始化
  getUserInfo();

  return {
    editFormInfo,
    userInfo,
    avatarName,
    permissionFormInfo,
    handleEdit,
    handlePermission,
    getUserInfo,
  };
});

export default useEditStore;
