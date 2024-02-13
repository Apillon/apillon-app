<template>
  <AnimationLoader />
</template>

<script lang="ts" setup>
type LoginData = {
  sessionToken: string;
  projectUuid: string;
  path?: string;
};
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
      onAdminLogin(event.data);

      window.removeEventListener('message', onWindowLoaded, false);
    }
  };
  window.addEventListener('message', onWindowLoaded, false);
});

async function onAdminLogin(data: LoginData) {
  if (!data.sessionToken || !data.projectUuid) {
    authStore.logout();
    router.push('/');
    return;
  }
  clearAll();
  localStorage.removeItem(DataLsKeys.CURRENT_PROJECT_ID);

  authStore.setUserToken(toStr(data.sessionToken));
  await authStore.initUser();
  if (authStore.jwt) {
    authStore.adminSession = true;

    /** Load project data */
    dataStore.project.selected = data.projectUuid;
    localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, toStr(data.projectUuid));

    /** Redirect to project or other entity */
    router.push({ name: 'dashboard' });
    if (data.path) {
      setTimeout(() => router.push(data.path || ''), 500);
    }

    /** Message parent on successful login */
    window.parent.postMessage({ loggedIn: true }, '*');
  }
}
</script>
