<template>
  <div class="container flex flex-col justify-center items-center">
    <div class="text-center">
      <h1 class="mb-6">{{ $t('login.resetPassword') }}</h1>
      <p class="mb-7">{{ $t('login.enterNewPassword') }}</p>

      <AuthFormRegister class="mx-auto max-w-[520px] text-left" :reset-password="true" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

const { t } = useI18n();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: t('login.resetPassword'),
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.PASSWORD_RESET;
});
</script>
