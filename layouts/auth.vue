<template>
  <div class="relative min-h-screen h-full pb-20">
    <AuthHeader />
    <div class="container flex md:flex-auto py-0 md:py-10 relative z-1">
      <transition name="width" :duration="1000">
        <AnimationIcons v-if="isLogin" :num-of-icons="4" :animation-name="'Jet'" :size="'xl'" />
      </transition>

      <div
        v-if="isLogin || isSignUp"
        class="relative w-full md:w-1/2 md:min-w-[490px] md:max-w-[490px]"
      >
        <!-- <transition name="fade" :duration="1000">
        </transition> -->
        <slot />
      </div>
      <slot v-else />

      <transition name="width" :duration="1000">
        <AnimationIcons v-if="isSignUp" :num-of-icons="6" :animation-name="'Press'" :size="'xl'" />
      </transition>
    </div>
    <AuthFooter class="absolute left-0 right-0 bottom-0 w-full" />
  </div>
</template>

<script lang="ts" setup>
import { clearAllBodyScrollLocks } from 'body-scroll-lock';
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';
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
onUnmounted(() => {
  clearAllBodyScrollLocks(document);
});
</script>
