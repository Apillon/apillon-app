<template>
  <component
    :is="authStore.loggedIn ? NuxtLink : 'a'"
    :to="authStore.loggedIn ? link : undefined"
    :href="!authStore.loggedIn ? 'https://apillon.io/' : undefined"
    class="inline-block text-center"
  >
    <img
      v-if="version < 1"
      :src="`/images/logo/apillon-beta@2x.png?ver='${version}`"
      :width="168"
      :height="24"
      :alt="alt"
    />
    <img v-else src="/images/logo/apillon.png" :width="width" :height="height" :alt="alt" />
  </component>
</template>

<script lang="ts" setup>
defineProps({
  alt: { type: String, default: 'Apillon logo' },
  height: { type: Number, default: 19 },
  width: { type: Number, default: 110 },
});

const authStore = useAuthStore();
const NuxtLink = resolveComponent('NuxtLink');

const link = computed(() => {
  return authStore.loggedIn ? { name: 'dashboard' } : { name: 'login' };
});

/** App version */
const config = useRuntimeConfig();
const version = ref<number>(parseFloat(config.public.VERSION));
</script>
