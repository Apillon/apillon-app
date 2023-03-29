<template>
  <div class="relative flex flex-col min-h-screen h-full py-16">
    <div class="container">
      <AuthHeader />
    </div>
    <div class="container flex items-center md:flex-auto relative z-1">
      <slot />
    </div>
    <div class="container">
      <AuthFooter />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { clearAllBodyScrollLocks } from 'body-scroll-lock';
import { createDiscreteApi } from 'naive-ui';

/** Global messages */
const { message } = createDiscreteApi(['message'], MessageProviderOptoins);
window.$message = message;

/**
 * Disable body scroll
 */
onUnmounted(() => {
  clearAllBodyScrollLocks();
});
</script>
