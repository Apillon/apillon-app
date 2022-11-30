<template>
  <div class="relative min-h-screen h-full pb-28 md:pb-20">
    <AuthHeader />
    <div class="container flex md:flex-auto py-0 md:py-10 relative z-1">
      <slot />
    </div>
    <AuthFooter class="absolute left-0 right-0 bottom-0 w-full" />
  </div>
</template>

<script lang="ts" setup>
import { clearAllBodyScrollLocks } from 'body-scroll-lock';

/**
 * Disable body scroll
 */
onUnmounted(() => {
  clearAllBodyScrollLocks(document);
});
</script>
