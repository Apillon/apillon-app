<template>
  <Dashboard :loading="true" />
</template>

<script lang="ts" setup>
const { query } = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onBeforeMount(async () => {
  if (!query.sessionToken) {
    router.push('/');
    return;
  }
  authStore.setUserToken(toStr(query.sessionToken));

  await authStore.initUser();
  if (authStore.jwt) {
    /** Redirect to project */
    if (query.projectUuid) {
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, toStr(query.projectUuid));
    }
    router.push({ name: 'dashboard' });
  }
});
</script>
