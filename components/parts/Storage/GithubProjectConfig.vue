<template>
  <Btn
    v-bind="$attrs"
    :inner-class="['flex items-center', { 'text-white': !storageStore.projectConfig }]"
    :type="storageStore.projectConfig ? 'secondary' : 'primary'"
    :color="storageStore.projectConfig ? '' : '#25292e'"
    :loading="loading"
    @click="handleGithubPress"
  >
    <span class="icon-github mr-2 text-lg"></span>
    <span>{{ $t(storageStore.projectConfig ? 'hosting.github.connected' : 'hosting.github.connect') }}</span>
  </Btn>

  <!-- Modal - Delete file/folder -->
  <ModalDelete v-model:show="isConfirmationModalVisible" :title="$t(`hosting.github.disconnect`)">
    <template #content>
      <p>
        {{ $t(`hosting.github.disconnectQuestion`) }}
      </p>
    </template>
    <Btn class="w-full" type="primary" :loading="loading" @click="disconnectGithub">
      {{ $t('general.disconnect') }}
    </Btn>
  </ModalDelete>
</template>

<script lang="ts" setup>
const storageStore = useStorageStore();
const { t } = useI18n();
const config = useRuntimeConfig();
const oauthToken = computed(() => $route.query.code);
const $route = useRoute();
const $router = useRouter();
const dataStore = useDataStore();
const message = useMessage();
const isConfirmationModalVisible = ref(false);

const loading = ref(false);

onMounted(async () => {
  if (oauthToken.value) {
    const projectUuid = dataStore.projectUuid;
    try {
      await $api.post<any>(endpoints.linkGithub, {
        code: oauthToken.value,
        project_uuid: projectUuid,
      });
      $router.replace($route.path);
      message.success(t('hosting.github.connectedNotice'));
    } catch (e) {
      console.error(e);
    }
  }
  storageStore.getGithubProjectConfig();
});

function handleGithubPress() {
  if (storageStore.projectConfig) {
    isConfirmationModalVisible.value = true;
  } else {
    connectToGithub();
  }
}

function connectToGithub() {
  try {
    window.open(
      'https://github.com/login/oauth/authorize?client_id=' +
        config.public.deploymentGithubId +
        '&redirect_uri=' +
        window.location.href +
        '&scope=repo,admin:repo_hook,user:email',
      '_self'
    );
  } catch (e) {
    console.log('Error connecting to Github');
    console.log(e);
  }
}

async function disconnectGithub() {
  loading.value = true;

  if (!dataStore.projectUuid) {
    loading.value = false;
    return;
  }

  try {
    await $api.post(endpoints.unlinkGithub, {
      project_uuid: dataStore.projectUuid,
    });
    storageStore.projectConfig = undefined;
    message.success(t('hosting.github.disconnectedNotice'));
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }

  loading.value = false;
  isConfirmationModalVisible.value = false;
}
</script>
