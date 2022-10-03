<template>
  <NuxtLink to="/" class="inline-block text-center h-10">
    <Image
      v-if="isLogoWhite"
      src="/images/logo/authtrail-white.png"
      :width="178"
      :height="40"
      :alt="alt"
    />
    <Image v-else src="/images/logo/authtrail-dark.png" :width="178" :height="40" :alt="alt" />
  </NuxtLink>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth';
import { AuthStep } from '~~/types/auth';

defineProps({
  alt: { type: String, default: 'logo' },
});

const authStore = useAuthStore();
const isLogoWhite = computed(() => {
  return authStore.authStep === AuthStep.LOGIN;
});
</script>
