<template>
  <a-modal
    v-model:visible="isPermissionOpen"
    :hide-cancel="true"
    :modal-style="{ width: isSmall ? '95vw' : '', margin: '12px 0px' }"
  >
    <template #title>
      {{ $t('edit.permission') }}
    </template>
    <a-space direction="vertical" fill>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" title="选择成员">
          <a-space direction="vertical" fill>
            请选择需要改动的组：
            <a-select v-model="selectedGroup">
              <a-option
                v-for="group in editStore.userInfo.groups"
                :key="group"
                >{{ group }}</a-option
              >
            </a-select>
            请选择需要设置的权限：
            <a-select v-model="setRoleType">
              <a-option>admin</a-option>
              <a-option>member</a-option>
            </a-select>

            <a-grid :cols="isSmall ? 1 : 2" :row-gap="5" :col-gap="5">
              <a-grid-item v-for="(user, i) in users" :key="user.Phone">
                <!-- 这个组件居然是非受控的，感觉是 React 写多了导致的 -->
                <a-tag
                  :checked="isUserSelected[i]"
                  checkable
                  color="blue"
                  @check="(e) => (isUserSelected[i] = e)"
                >
                  <span style="font-size: 14px"
                    >🤗: {{ user.Name }} 📱: {{ user.Phone }}</span
                  ></a-tag
                >
              </a-grid-item>
            </a-grid>

            <a-button
              type="primary"
              long
              size="large"
              :disabled="!selectedGroup || !setRoleType"
              @click="handleSubmit()"
            >
              {{ $t('register.form.confirm') }}
            </a-button>
          </a-space>
        </a-tab-pane>
        <a-tab-pane key="2" title="手动输入">
          <a-form :model="manualData">
            <a-form-item field="Phone" label="Phone">
              <a-input v-model="manualData.phone" />
            </a-form-item>
            <a-form-item field="JoinTime" label="JoinTime">
              <a-input
                v-model="manualData.joinTime"
                placeholder="2025A or ..."
              />
            </a-form-item>
            <a-form-item field="group" label="group">
              <a-input v-model="manualData.group" placeholder="web or ..." />
            </a-form-item>
            <a-form-item field="role" label="role">
              <a-input
                v-model="manualData.role"
                placeholder="admin or member"
              />
            </a-form-item>
            <a-form-item>
              <a-button html-type="submit" @click="handleManualSubmit()"
                >提交</a-button
              >
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-space>
    <template #footer>
      {{ '' }}
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { inject, reactive, ref, watch } from 'vue';
import { getAllUsers, userInfoT } from '@/api/getAllUsers';
import { PermissionRequest } from '@/constants/httpMsg/register/PermissionMsg';
import { Message } from '@arco-design/web-vue';
import i18n from '@/locale';
import { useEditStore } from './store';

defineProps<{
  isSmall: boolean;
}>();

const editStore = useEditStore();

const isPermissionOpen = inject('isPermissionOpen', () => ref(false), true);

const users = ref<userInfoT[]>([]);
const isUserSelected = ref<boolean[]>([]);
const setRoleType = ref('');

const manualData = reactive<PermissionRequest>({
  joinTime: '',
  phone: '',
  group: '',
  role: '',
});

const selectedGroup = ref('');
watch(selectedGroup, async () => {
  if (selectedGroup.value && users.value.length === 0) {
    users.value = await getAllUsers(selectedGroup.value);
    isUserSelected.value = users.value.map(() => false);
  }
});

const handleSubmit = () => {
  const datas: PermissionRequest[] = users.value
    .filter((_, k) => isUserSelected.value[k])
    .map((v) => ({
      phone: v.Phone,
      joinTime: v.JoinTime,
      group: selectedGroup.value,
      role: setRoleType.value,
    }));

  if (datas.length === 0) {
    Message.warning('已选择用户数为0');
    return;
  }

  Promise.all(
    datas.map(async (data) => {
      const res = await editStore.handlePermission(data);
      if (res !== null) {
        Message.success(`${i18n.global.t('edit.success')}:${data.phone}`);
      } else {
        Message.error(`请求错误:${data.phone}`);
      }
    }),
  ).then(() => {
    isPermissionOpen.value = false;
  });
};

const handleManualSubmit = () => {
  editStore.handlePermission(manualData).then((res) => {
    if (res !== null) {
      Message.success(`${i18n.global.t('edit.success')}:${res.message}`);
    } else {
      Message.error(`请求错误:${manualData.phone}`);
    }
    isPermissionOpen.value = false;
  });
};
</script>
