<template>
  <component
    :is="authStore.loggedIn ? NuxtLink : 'a'"
    :to="authStore.loggedIn ? link : undefined"
    :href="!authStore.loggedIn ? 'https://apillon.io/' : undefined"
    class="inline-block text-center"
  >
    <NuxtIcon
      name="logo/apillon"
      class="icon-inherit block"
      :alt="alt"
      :style="{ width: `${width}px`, height: `${height}px` }"
    />
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
</script>
