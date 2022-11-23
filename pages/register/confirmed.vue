<template>
  <div class="w-full flex flex-col justify-center items-center">
    <div class="text-center">
      <div class="mb-7 text-center text-blue">
        <span class="icon-new text-[34px]"></span>
      </div>
      <h1 class="mb-6 text-center">{{ $t('signup.emailConfirmed') }}</h1>
      <p class="mb-7">{{ $t('signup.enterDesiredPassword') }}</p>

      <FormPassword class="mx-auto max-w-[520px] text-left" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AuthStep } from '~~/types/auth';
import { useAuthStore } from '~~/stores/auth';
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});
useHead({
  title: 'SignUp - e-mail seccessfully confirmed',
});

onBeforeMount(() => {
  authStore.authStep = AuthStep.SIGN_UP_CONFIRMED;
});
</script>
