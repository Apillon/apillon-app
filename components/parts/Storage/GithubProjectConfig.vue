<template>
  <Btn
    v-bind="$attrs"
    :type="storageStore.projectConfig ? 'secondary' : 'primary'"
    :loading="loading"
    @click="handleGithubPress"
  >
    <span class="icon-github -ml-1 mr-2" /><span>{{
      $t(storageStore.projectConfig ? 'hosting.github-connected' : 'hosting.connect-github')
    }}</span>
  </Btn>

  <!-- Modal - Delete file/folder -->
  <ModalDelete v-model:show="isConfirmationModalVisible" :title="$t(`hosting.disconnect-confirmation-title`)">
    <template #content>
      <p>
        {{ $t(`hosting.disconnect-confirmation-body`) }}
      </p>
    </template>
    <Btn type="secondary" :loading="loading" @click="disconnectGithub">
      {{ $t('hosting.disconnect-confirmation-button') }}
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
      message.success(t('hosting.github-connected-notice'));
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
    message.success(t('hosting.github-disconnected-notice'));
  } catch (e) {
    message.error(userFriendlyMsg(e));
  }

  loading.value = false;
  isConfirmationModalVisible.value = false;
}
</script>
