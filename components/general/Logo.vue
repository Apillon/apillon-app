<template>
  <NuxtLink :to="link" class="inline-block text-center">
    <img src="/images/logo/apillon.png" :width="162" :height="28" :alt="alt" />
  </NuxtLink>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';

defineProps({
  alt: { type: String, default: 'Apillon logo' },
});

const authStore = useAuthStore();

const link = computed(() => {
  return authStore.loggedIn ? { name: 'dashboard' } : { name: 'login' };
});
</script>
