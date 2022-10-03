<template>
  <div class="relative min-h-screen h-full pb-20" :class="wrapperClass">
    <div class="absolute bg-dark top-0 h-full w-1/2 transition-all duration-300" :class="bgClass">
      <div
        class="absolute left-1/2 top-1/2 w-[60vmin] h-[60vmin] bg-pink/20 blur-[100px] -translate-x-1/2 -translate-y-1/2"
      ></div>
    </div>
    <!-- <div class="absolute right-0 bottom-0 h-full w-full bg-login bg-no-repeat bg-right-bottom"></div> -->
    <img class="absolute right-0 bottom-0" src="/assets/images/bg-login.png" alt="bg-login" />
    <div class="relative z-1">
      <AuthHeader />
      <slot />
    </div>
    <AuthFooter class="absolute left-0 right-0 bottom-0 w-full" />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';
const authStore = useAuthStore();

const wrapperClass = computed(() => {
  return [
    authStore.authStep === AuthStep.SIGN_UP ||
    authStore.authStep === AuthStep.SIGN_UP_CONFIRM ||
    authStore.authStep === AuthStep.SIGN_UP_CONFIRMED
      ? 'bg-white'
      : 'bg-grey-lightest',
  ];
});

const bgPosition = computed(() => {
  switch (authStore.authStep) {
    case AuthStep.LOGIN:
      return 'left';
    case AuthStep.SIGN_UP ||
      AuthStep.LOGIN_FIRST ||
      AuthStep.LOGIN_FIRST_PROJECT ||
      AuthStep.LOGIN_FIRST_PROJECT_BUILD:
      return 'right';
    default:
      return '';
  }
});

const bgClass = computed(() => {
  return [
    bgPosition.value === 'left'
      ? 'left-0 clip-path-bg-left'
      : bgPosition.value === 'right'
      ? 'left-1/2 clip-path-bg-right'
      : 'd-none hide hidden',
  ];
});
</script>
