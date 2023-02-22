<template></template>

<script lang="ts" setup>
const authStore = useAuthStore();
const router = useRouter();

definePageMeta({
  layout: 'auth',
});

onBeforeMount(() => {
  if (authStore.loggedIn) {
    router.push({ name: 'dashboard' });
  }
  router.push({ name: 'login' });
});
</script>
