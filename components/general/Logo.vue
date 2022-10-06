<template>
  <NuxtLink to="/" class="inline-block text-center h-10">
    <Image src="/images/logo/apillon.png" :width="178" :height="40" :alt="alt" />
  </NuxtLink>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';

defineProps({
  alt: { type: String, default: 'Apillon logo' },
});

const authStore = useAuthStore();
</script>
