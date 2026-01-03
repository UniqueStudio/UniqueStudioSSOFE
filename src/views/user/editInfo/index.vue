<template>
  <div
    class="w-full sm:w-3/4 bg-white mt-20 sm:ml-64 sm:min-w-900 flex flex-col sm:flex-row"
  >
    <div class="w-60 mt-10 sm:mt-16 sm:ml-16 mx-auto">
      <a-avatar
        :style="{ backgroundColor: '#3370ff' }"
        class="ml-10 sm:ml-0"
        :size="160"
      >
        {{ editStore.avatarName }}
      </a-avatar>
    </div>
    <div class="w-5/6 h-full m-16">
      <a-space direction="vertical" size="large" fill>
        <p class="font-bold text-lg">{{ $t('edit.userinfo') }}</p>
        <a-descriptions
          title=""
          class="hidden sm:block"
          size="large"
          layout="inline-vertical"
          :label-style="{
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '15px',
            marginRight: '100px',
          }"
          :value-style="{ fontSize: '16px' }"
        >
          <a-descriptions-item
            v-for="item of data"
            :key="item.value"
            :label="item.label"
            :span="1"
          >
            {{ item.value }}
          </a-descriptions-item>
        </a-descriptions>
        <a-descriptions
          title=""
          class="block sm:hidden"
          size="large"
          :column="1"
          :label-style="{
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '15px',
            marginRight: '100px',
          }"
          :value-style="{ fontSize: '16px' }"
        >
          <a-descriptions-item
            v-for="item of data"
            :key="item.value"
            :label="item.label"
            :span="1"
          >
            {{ item.value }}
          </a-descriptions-item>
        </a-descriptions>
      </a-space>
      <a-button
        type="primary"
        size="large"
        class="float-right"
        @click="openEditModel"
      >
        {{ $t('edit.change') }}
      </a-button>

      <a-button
        type="primary"
        size="large"
        class="float-right mr-10"
        :disabled="!userInfo.roles.includes('admin')"
        @click="openPermissionModel"
      >
        {{ $t('edit.permission') }}
      </a-button>
    </div>
  </div>
  <a-modal
    v-model:visible="isEditOpen"
    :hide-cancel="true"
    :modal-style="{ maxHeight: '700px', width: isSmall ? '300px' : '' }"
  >
    <template #title>
      {{ $t('edit.changeinfo') }}
    </template>
    <a-form ref="editForm" :model="editFormInfo" layout="vertical">
      <a-form-item
        field="name"
        hide-label
        :rules="[{ required: true, message: $t('register.form.name.errMsg') }]"
      >
        <a-input
          v-model="editFormInfo.name"
          size="large"
          :placeholder="$t('register.form.name')"
          allow-clear
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="gender"
        hide-label
        :rules="[
          { required: true, message: $t('register.form.gender.errMsg') },
        ]"
      >
        <a-select
          v-model="editFormInfo.gender"
          size="large"
          :placeholder="$t('register.form.gender.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-user-group />
          </template>
          <a-option :value="Gender.male">男</a-option>
          <a-option :value="Gender.female">女</a-option>
          <a-option :value="Gender.other">其它</a-option>
        </a-select>
      </a-form-item>
      <a-form-item
        field="email"
        hide-label
        :rules="[
          { required: true, message: $t('login.form.email.errMsg') },
          {
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: $t('login.form.email.formatErr'),
          },
        ]"
      >
        <a-input
          v-model="editFormInfo.email"
          size="large"
          :placeholder="$t('register.form.email')"
          allow-clear
        >
          <template #prefix>
            <Icon-email />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="qq"
        hide-label
        :rules="[
          { required: false, message: $t('register.form.qq.errMsg') },
          {
            match: /^\d{1,15}$/,
            message: $t('edit.form.qq.formatErr'),
          },
        ]"
      >
        <a-input
          v-model="editFormInfo.qq"
          size="large"
          :placeholder="$t('register.form.qq')"
          allow-clear
        >
          <template #prefix>
            <img src="/qq-outline.svg" alt="qq" class="w-4 h-4" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        hide-label
        :rules="[
          { required: false, message: $t('login.form.password.errMsg') },
          { minLength: 6, message: $t('login.form.password.minLength') },
        ]"
      >
        <a-input-password
          v-model="editFormInfo.password"
          size="large"
          :placeholder="$t('register.form.password')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
    </a-form>
    <a-button type="primary" long size="large" @click="handleEdit(editForm)">
      {{ $t('register.form.confirm') }}
    </a-button>
    <template #footer>
      {{ '' }}
    </template>
  </a-modal>

  <PermissionModal :is-small="isSmall" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, Ref, provide } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

// type
import { throttle } from 'lodash';
import { Gender } from './type';
// store
import { useEditStore } from './store';
import PermissionModal from './PermissionModal.vue';

const { t } = useI18n();

const editStore = useEditStore();
const { handleEdit } = editStore;

const editForm = ref(null);

const { editFormInfo, userInfo } = storeToRefs(editStore);

const isEditOpen = ref(false);
const isPermissionOpen = ref(false);
provide('isPermissionOpen', isPermissionOpen);

const openEditModel = () => {
  isEditOpen.value = true;
};
const openPermissionModel = () => {
  isPermissionOpen.value = true;
};

interface DataItem {
  label: string;
  value: string;
}

const genders = ['0', '男', '女', '其他'];
const isSmall: Ref<boolean> = ref(true);

// 使用 computed 计算派生数据
const data = computed<DataItem[]>(() => [
  {
    label: t('edit.name'),
    value: userInfo.value.name,
  },
  {
    label: t('edit.gender'),
    value: genders[userInfo.value.gender || 0],
  },
  {
    label: t('edit.phonenumber'),
    value: userInfo.value.phoneNumber,
  },
  {
    label: t('edit.email'),
    value: userInfo.value.email,
  },
  {
    label: t('edit.qq'),
    value: userInfo.value.qq,
  },
]);

const checkScreenSize = throttle(
  () => {
    isSmall.value = window.innerWidth < 600;
  },
  500,
  {
    trailing: true,
    leading: false,
  },
);

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => window.removeEventListener('resize', checkScreenSize));
</script>

<style scoped lang="less"></style>
