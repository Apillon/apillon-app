<template>
  <div class="relative min-h-screen h-full pb-20">
    <AuthHeader />
    <slot />
    <AuthFooter class="absolute left-0 right-0 bottom-0 w-full" />
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';
const authStore = useAuthStore();
</script>
