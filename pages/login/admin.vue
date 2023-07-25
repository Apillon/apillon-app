<template>
  <AnimationLoader />
</template>

<script lang="ts" setup>
const { query } = useRoute();
const router = useRouter();
const authStore = useAuthStore();

definePageMeta({
  layout: 'auth',
});

onMounted(() => {
  window.addEventListener(
    'message',
    event => {
      onAdminLogin(event.data?.sessionToken);
    },
    false
  );
});

async function onAdminLogin(sessionToken?: string) {
  if (!sessionToken) {
    router.push('/');
    return;
  }
  authStore.setUserToken(toStr(sessionToken));
  await authStore.initUser();
  if (authStore.jwt) {
    authStore.adminSession = true;

    /** Redirect to project */
    if (query.projectUuid) {
      localStorage.setItem(DataLsKeys.CURRENT_PROJECT_ID, toStr(query.projectUuid));
    }
    router.push({ name: 'dashboard' });

    /** Message parent on successful login */
    window.parent.postMessage({ loggedIn: true }, '*');
  }
}
</script>
