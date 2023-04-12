<template>
  <div class="relative flex flex-col justify-center align-middle min-h-screen h-full bg-bg-dark">
    <div class="container card relative max-w-lg py-16 sm:px-8 md:px-12 lg:px-16">
      <AuthHeader />

      <div class="relative">
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta?.transition as string || 'fadeBlur'" :duration="500">
            <component :is="Component" class="w-full" />
          </transition>
        </router-view>
      </div>

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
onMounted(() => {
  clearAllBodyScrollLocks();
});
</script>
