<template v-if="sessionToken !== ''">
  <Btn v-bind="$attrs" type="primary" @click="openPopup()">
    <div class="flex items-center">
      <NuxtIcon :name="`auth/kilt-logo`" class="text-xl align-sub mr-2" filled />
      <span class="text-xl align-sub mr-2"></span>
      {{ $t('auth.login.kilt') }}
    </div>
  </Btn>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig();
const authStore = useAuthStore();
const dataStore = useDataStore();
const sessionToken = ref<string | undefined>('');
const oauthAuthToken = ref<string | undefined>('');
const childWindow = ref<(Window & typeof globalThis) | undefined>();
const handlerFunction = ref();

onMounted(async () => {
  sessionToken.value = await getOauthSession();

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

async function getOauthSession() {
  try {
    const response = await $api.get<OauthSessionResponse>(endpoints.oauthSession);
    return response.data.data.session;
  } catch (error) {
    console.error(error);
  }
}

function openPopup() {
  childWindow.value = window.open(
    `${config.public.oauthUrl}?embedded=1&token=${sessionToken.value}`,
    'Apillon Auth Form',
    `height=${900} width=${450} resizable=no`
  ) as Window & typeof globalThis;
}
</script>
