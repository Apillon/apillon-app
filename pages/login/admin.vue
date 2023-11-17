<template>
  <AnimationLoader />
</template>

<script lang="ts" setup>
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
  window.parent.postMessage('loaded', '*');

  // listen for messages from the parent.
  window.addEventListener(
    'message',
    event => {
      if (event.origin === config.public.adminUrl) {
        onAdminLogin(event.data?.sessionToken, event.data?.projectUuid);
      }
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
  clearAll();
  localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);

  authStore.setUserToken(toStr(sessionToken));
  await authStore.initUser();
  if (authStore.jwt) {
    authStore.adminSession = true;

    /** Load project data */
    const project = await dataStore.fetchProject(projectUuid);
    dataStore.project.items = [project];
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, toStr(projectUuid));

    /** Redirect to project */
    router.push({ name: 'dashboard' });

    /** Message parent on successful login */
    window.parent.postMessage({ loggedIn: true }, '*');
  }
}
</script>
