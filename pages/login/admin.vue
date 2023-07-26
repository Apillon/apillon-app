<template>
  <AnimationLoader />
</template>

<script lang="ts" setup>
const router = useRouter();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});

onMounted(() => {
  window.addEventListener(
    'message',
    event => {
      onAdminLogin(event.data?.sessionToken, event.data?.projectUuid);
    },
    false
  );
});

async function onAdminLogin(sessionToken?: string, projectUuid?: string) {
  if (!sessionToken || !projectUuid) {
    authStore.logout();
    router.push('/');
    return;
  }
  localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);

  authStore.setUserToken(toStr(sessionToken));
  await authStore.initUser();
  if (authStore.jwt) {
    authStore.adminSession = true;

    /** Redirect to project */
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, toStr(projectUuid));
    router.push({ name: 'dashboard' });

    /** Message parent on successful login */
    window.parent.postMessage({ loggedIn: true }, '*');
  }
}
</script>
