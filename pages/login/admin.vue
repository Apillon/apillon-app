<template>
  <AnimationLoader />
</template>

<script lang="ts" setup>
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const dataStore = useDataStore();
const config = useRuntimeConfig();
const { clearAll } = useStore();

definePageMeta({
  layout: 'auth',
});

onMounted(() => {
  // signal the parent that we're loaded.
  if (window.opener) {
    window.opener.postMessage('loaded', '*');
  } else if (window.parent) {
    window.parent.postMessage('loaded', '*');
  }

  // listen for messages from the parent.
  const onWindowLoaded = event => {
    if (event.origin === config.public.adminUrl && event.data?.projectUuid) {
      onAdminLogin(event.data?.sessionToken, event.data?.projectUuid);

      window.removeEventListener('message', onWindowLoaded, false);
    }
  };
  window.addEventListener('message', onWindowLoaded, false);
});

async function onAdminLogin(sessionToken?: string, projectUuid?: string) {
  if (!sessionToken || !projectUuid) {
    authStore.logout();
    router.push('/');
    return;
  }
  clearAll();
  localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);

  authStore.setUserToken(toStr(sessionToken));
  await authStore.initUser();
  if (authStore.jwt) {
    authStore.adminSession = true;

    /** Load project data */
    dataStore.project.selected = projectUuid;
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, toStr(projectUuid));

    /** Redirect to project */
    router.push({ name: 'dashboard' });

    /** Message parent on successful login */
    window.parent.postMessage({ loggedIn: true }, '*');
  }
}
</script>
