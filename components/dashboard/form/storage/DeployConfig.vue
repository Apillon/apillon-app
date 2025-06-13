<template>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    :model="websiteStore.form"
    :disabled="isFormDisabled"
    :rules="rulesWebsite"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <FormFieldRepo v-if="!isSimplet" v-model:value="websiteStore.form.repoId" :disabled="!!configId" />
    <n-form-item path="branchName" :label="$t('form.label.website.branchName')" :label-props="{ for: 'branchName' }">
      <n-input
        v-model:value="websiteStore.form.branchName"
        :input-props="{ id: 'branchName' }"
        :placeholder="$t('form.placeholder.website.branchName')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="installCommand"
      :label="$t('form.label.website.installCommand')"
      :label-props="{ for: 'installCommand' }"
    >
      <n-input
        v-model:value="websiteStore.form.installCommand"
        :input-props="{ id: 'installCommand' }"
        :placeholder="$t('form.placeholder.website.installCommand')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="buildCommand"
      :label="$t('form.label.website.buildCommand')"
      :label-props="{ for: 'buildCommand' }"
    >
      <n-input
        v-model:value="websiteStore.form.buildCommand"
        :input-props="{ id: 'buildCommand' }"
        :placeholder="$t('form.placeholder.website.buildCommand')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="buildDirectory"
      :label="$t('form.label.website.buildDirectory')"
      :label-props="{ for: 'buildDirectory' }"
    >
      <n-input
        v-model:value="websiteStore.form.buildDirectory"
        :input-props="{ id: 'buildDirectory' }"
        :placeholder="$t('form.placeholder.website.buildDirectory')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="installCommand"
      :label="$t('form.label.website.installCommand')"
      :label-props="{ for: 'installCommand' }"
    >
      <n-input
        v-model:value="websiteStore.form.installCommand"
        :input-props="{ id: 'installCommand' }"
        :placeholder="$t('form.placeholder.website.installCommand')"
        clearable
      />
    </n-form-item>

    <FormFieldApiKey
      :config-id="configId"
      :api-key="websiteStore.form.apiKey"
      :api-secret="websiteStore.form.apiSecret"
      @update:api-key="apiKey => (websiteStore.form.apiKey = apiKey)"
      @update:api-secret="apiSecret => (websiteStore.form.apiSecret = apiSecret)"
    />

    <n-form-item :show-feedback="false">
      <input type="submit" class="hidden" :value="'Save'" />

      <div class="flex w-full gap-2">
        <!-- Unlink is disabled
        <Btn v-if="configId" type="secondary" :loading="deleteLoading" :disabled="isFormDisabled" @click="handleRemove">
          {{ $t('hosting.deploy.unlink') }}
        </Btn>
        -->
        <Btn type="primary" class="flex-1" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
          {{ $t('hosting.deploy.save') }}
        </Btn>
      </div>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess', 'close']);
const props = defineProps({
  configId: { type: Number, default: 0 },
  isSimplet: { type: Boolean, default: false },
});

const message = useMessage();
const dataStore = useDataStore();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

const { t } = useI18n();
const { rulesWebsite } = useHosting();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

const deleteLoading = ref<boolean>(false);

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

onMounted(async () => {
  if (props.isSimplet) {
    await simpletStore.getSimpletTemplates();

    const repoSimplet = simpletStore.templates.find(t => t.name === 'nft-studio') || simpletStore.templates[0];
    if (repoSimplet) {
      websiteStore.form.repoId = repoSimplet.id;
      websiteStore.form.repoName = repoSimplet.name;
      websiteStore.form.branchName = 'main';
      websiteStore.form.repoOwnerName = apillonOwner.login;
      websiteStore.form.repoUrl = repoSimplet.frontendRepo;
    }
  }
});

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();

  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || t('general.error'))));
    } else if (dataStore.projectUuid && websiteStore.active) {
      const bodyData = {
        projectUuid: dataStore.projectUuid,
        websiteUuid: websiteStore.active.website_uuid,
        ...websiteStore.form,
      };
      return props.configId ? updateDeployConfig(bodyData) : createDeployConfig(bodyData);
    }
  });
}

async function handleRemove() {
  deleteLoading.value = true;
  try {
    await $api.delete(endpoints.deployConfig(websiteStore.active.website_uuid));
    websiteStore.active.source = WebsiteSource.APILLON;
    deploymentStore.deploymentConfig = {} as DeploymentConfigInterface;
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  deleteLoading.value = false;
}

async function createDeployConfig(bodyData: Record<string, any>) {
  loading.value = true;
  try {
    await $api.post<DeploymentConfigResponse>(endpoints.deployConfig(), bodyData);

    message.success(t('hosting.deploy.success'));
    websiteStore.active.source = WebsiteSource.GITHUB;
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  } finally {
    loading.value = false;
  }
}

async function updateDeployConfig(bodyData: Record<string, any>) {
  loading.value = true;
  try {
    await $api.patch<DeploymentConfigResponse>(endpoints.deployConfig(props.configId), bodyData);

    message.success(t('hosting.deploy.updated'));
    websiteStore.active.source = WebsiteSource.GITHUB;
    emit('submitSuccess');
  } catch (error: any) {
    message.error(userFriendlyMsg(error));
  } finally {
    loading.value = false;
  }
}
</script>
