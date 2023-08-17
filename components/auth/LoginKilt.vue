<template>
  <Btn v-bind="$attrs" type="primary" @click="openPopup()">
    <div class="flex items-center">
      <NuxtIcon name="logo/favicon_kilt_light" class="text-2xl align-sub" filled />
      {{ $t('auth.login.kilt') }}
    </div>
  </Btn>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const authStore = useAuthStore();
const dataStore = useDataStore();
const { clearAll } = useStore();
const oauthAuthToken = ref<string | undefined>('');
const childWindow = ref<(Window & typeof globalThis) | undefined>();
const handlerFunction = ref();

const props = defineProps({
  sessionToken: { type: String, default: '' },
});

onMounted(() => {
  // Handler function for the message event from the oauth module
  handlerFunction.value = async event => {
    if (event.data.verified) {
      oauthAuthToken.value = event.data.data.userData;
      // Close before proceeding
      childWindow.value?.close();
      await loginWithKilt();
    }
  };
  window.addEventListener('message', handlerFunction.value, false);
});

onUnmounted(() => {
  window.removeEventListener('message', handlerFunction.value, false);
});

async function loginWithKilt() {
  try {
    // Logout first - delete LS and store if there is any data
    authStore.logout();
    dataStore.resetCurrentProject();

    /** Clear all stored data */
    clearAll();

    const res = await $api.post<LoginResponse>(endpoints.loginWithKilt, {
      token: oauthAuthToken.value,
    });
    authStore.saveUser(res.data);

    /** Fetch projects, if user hasn't any project redirect him to '/onboarding/first' so he will be able to create first project */
    dataStore.project.items = await dataStore.fetchProjects(true);
  } catch (error) {
    console.error(error);
  }
}

function openPopup() {
  childWindow.value = window.open(
    `${config.public.oauthUrl}?embedded=1&token=${props.sessionToken}`,
    'Apillon Auth Form',
    `height=${900} width=${450} resizable=no`
  ) as Window & typeof globalThis;
}
</script>
