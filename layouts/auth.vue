<template>
  <div class="relative flex flex-col min-h-screen h-full pb-28 md:pb-20">
    <AuthHeader />
    <div
      class="container flex items-center md:flex-auto py-10 relative z-1 flex-wrap md:flex-nowrap"
    >
      <transition name="width" :duration="1000">
        <AnimationIcons
          v-if="isLogin"
          :num-of-icons="4"
          :animation-name="'jet'"
          :size="'xl'"
          class="order-3 md:order-1"
        />
      </transition>

      <div
        v-if="isLogin || isSignUp"
        class="relative w-full md:w-1/2 md:min-w-[50%] md:max-w-[522px] lg:min-w-[522px] order-2"
      >
        <slot />
      </div>
      <slot v-else />

      <transition name="width" :duration="1000">
        <AnimationIcons
          v-if="isSignUp"
          :num-of-icons="6"
          :animation-name="'press'"
          :size="'xl'"
          class="order-3"
        />
      </transition>
    </div>
    <AuthFooter class="absolute left-0 right-0 bottom-0 w-full" />
  </div>
</template>

<script lang="ts" setup>
import { clearAllBodyScrollLocks } from 'body-scroll-lock';
import { createDiscreteApi } from 'naive-ui';

/** Global messages */
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);
window.$message = message;

const authStore = useAuthStore();

const isLogin = computed(() => {
  return authStore.authStep === AuthStep.LOGIN;
});
const isSignUp = computed(() => {
  return authStore.authStep === AuthStep.SIGN_UP;
});
/**
 * Disable body scroll
 */
onMounted(() => {
  clearAllBodyScrollLocks();
});
</script>
