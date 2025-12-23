<template>
  <a-result
    status="404"
    :subtitle="$t('Page not found.')"
    class="h-screen flex flex-col justify-center"
  >
    <template #extra>
      <a-space>
        <a-button type="primary" @click="router.replace('/')">
          返回主页
        </a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import router from '@/router';
</script>

<style scoped lang="less"></style>
