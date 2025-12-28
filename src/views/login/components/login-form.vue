<template>
  <a-tabs
    v-model:active-key="loginMethod"
    :default-active-key="LoginMethod.phone"
    size="large"
  >
    <a-tab-pane :key="LoginMethod.phone" title="手机号">
      <a-form ref="phoneLoginRef" :model="loginFormInfo" layout="vertical">
        <a-form-item
          field="phoneNumber"
          hide-label
          :rules="[
            { required: true, message: $t('login.form.phoneNumber.errMsg') },
            {
              match: /^1[3-9]\d{9}$/,
              message: $t('login.form.phoneNumber.formatErr'),
            },
          ]"
        >
          <a-input
            v-model="loginFormInfo.phoneNumber"
            size="large"
            :placeholder="$t('login.form.phoneNumber.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-phone />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          hide-label
          :rules="[
            { required: true, message: $t('login.form.password.errMsg') },
            { minLength: 6, message: $t('login.form.password.minLength') },
          ]"
        >
          <a-input-password
            v-model="loginFormInfo.password"
            size="large"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
      <div class="flex justify-between w-full">
        <a-checkbox checked="rememberPassword">{{
          $t('login.form.rememberPassword')
        }}</a-checkbox>
      </div>
    </a-tab-pane>
    <a-tab-pane :key="LoginMethod.email" title="邮箱">
      <a-form ref="emailLoginRef" :model="loginFormInfo" layout="vertical">
        <a-form-item
          field="email"
          hide-label
          :rules="[
            { required: true, message: '邮箱不能为空' },
            {
              match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '邮箱格式错误',
            },
          ]"
        >
          <a-input
            v-model="loginFormInfo.email"
            size="large"
            placeholder="请填写邮箱"
            allow-clear
          >
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          hide-label
          :rules="[
            { required: true, message: $t('login.form.password.errMsg') },
            { minLength: 6, message: $t('login.form.password.minLength') },
          ]"
        >
          <a-input-password
            v-model="loginFormInfo.password"
            size="large"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
      <div class="flex justify-between w-full">
        <a-checkbox checked="rememberPassword">{{
          $t('login.form.rememberPassword')
        }}</a-checkbox>
      </div>
    </a-tab-pane>
    <a-tab-pane :key="LoginMethod.sms" title="验证码">
      <a-form ref="smsLoginRef" :model="loginFormInfo" layout="vertical">
        <a-form-item
          field="phoneNumber"
          hide-label
          :rules="[
            { required: true, message: $t('login.form.phoneNumber.errMsg') },
            {
              match: /^1[3-9]\d{9}$/,
              message: $t('login.form.phoneNumber.formatErr'),
            },
          ]"
        >
          <a-input
            v-model="loginFormInfo.phoneNumber"
            size="large"
            :placeholder="$t('login.form.phoneNumber.placeholder')"
            allow-clear
          >
            <template #prefix>
              <icon-phone />
            </template>
          </a-input>
          <a-button
            type="primary"
            size="large"
            :disabled="isSendValidateCode"
            class="w-[160px]"
            @click="handleValidateCode(smsLoginRef)"
            >{{ buttonContent }}</a-button
          >
        </a-form-item>
        <a-form-item
          field="validateCode"
          hide-label
          :validate-trigger="['change', 'blur']"
          :rules="[
            {
              required: true,
              message: $t('register.form.validateCode.errMsg'),
            },
          ]"
        >
          <a-input
            v-model="loginFormInfo.validateCode"
            size="large"
            :placeholder="$t('register.form.validateCode')"
            allow-clear
          >
            <template #prefix>
              <icon-safe />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-tab-pane>
  </a-tabs>
  <a-button type="primary" long size="large" class="mt-4" @click="login()">{{
    $t('login.form.login')
  }}</a-button>
  <a-button type="text" long class="mt-2" @click="setIsRegister(true)">{{
    $t('login.form.register')
  }}</a-button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';

// type
import { LoginMethod } from '../type';
// store
import { useLoginStore } from '../store';
import { validateAble } from '../store/useLogin';

const loginStore = useLoginStore();
const { setIsRegister, handleLogin, handleValidateCode } = loginStore;
const { loginFormInfo, loginMethod, isSendValidateCode, buttonContent } =
  storeToRefs(loginStore);

const phoneLoginRef = useTemplateRef('phoneLoginRef');
const smsLoginRef = useTemplateRef('smsLoginRef');
const emailLoginRef = useTemplateRef('emailLoginRef');

const refMap: Record<LoginMethod, any> = {
  [LoginMethod.phone]: phoneLoginRef,
  [LoginMethod.sms]: smsLoginRef,
  [LoginMethod.email]: emailLoginRef,
};

const login = () =>
  handleLogin(refMap[loginMethod.value].value as validateAble);

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    login();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style lang="less" scoped>
// 修改arcodesign-tabs原生样式
:deep(.arco-tabs-nav-tab-list) {
  width: 100%;

  .arco-tabs-tab {
    width: 33.3%;
    margin: 0;
    justify-content: center;
  }
}
</style>
