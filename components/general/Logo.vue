<template>
  <NuxtLink :to="link" class="inline-block text-center">
    <img
      v-if="version < 1"
      :src="`/images/logo/apillon-beta.png?ver='${version}`"
      :width="168"
      :height="24"
      :alt="alt"
    />
    <img v-else src="/images/logo/apillon.png" :width="width" :height="height" :alt="alt" />
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps({
  alt: { type: String, default: 'Apillon logo' },
  height: { type: Number, default: 19 },
  width: { type: Number, default: 110 },
});

const authStore = useAuthStore();

const link = computed(() => {
  return authStore.loggedIn ? { name: 'dashboard' } : { name: 'login' };
});

/** App version */
const config = useRuntimeConfig();
const version = ref<number>(parseFloat(config.public.VERSION));
</script>
