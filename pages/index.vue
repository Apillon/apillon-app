<template>
  <span></span>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const router = useRouter();

definePageMeta({
  layout: 'auth',
});

onBeforeMount(async () => {
  await Promise.resolve(authStore.promises.profile);

  if (authStore.loggedIn) {
    router.push({ name: 'dashboard' });
  }
  router.push({ name: 'login' });
});
</script>
