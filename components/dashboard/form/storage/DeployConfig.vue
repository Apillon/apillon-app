<template>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    :model="websiteStore.form"
    :disabled="isFormDisabled"
    :rules="rules"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <FormFieldRepo v-model:value="websiteStore.form.repoId" />
    <n-form-item path="branchName" :label="$t('form.label.website.branchName')" :label-props="{ for: 'branchName' }">
      <n-input
        v-model:value="websiteStore.form.branchName"
        :input-props="{ id: 'branchName' }"
        :placeholder="$t('form.placeholder.website.branchName')"
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
      @update:api-key="e => console.log(e)"
      @update:api-secret="e => console.log(e)"
    />

    <n-form-item v-if="!$props.onCreateWebsite" :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="'Save'" />

      <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
        {{ $t('hosting.deploy.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess', 'close']);
defineProps({
  configId: { type: Number, default: 0 },
  onCreateWebsite: { type: Boolean, default: false },
});

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const { rulesWebsite } = useHosting();

const loading = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);

const isFormDisabled = computed<boolean>(() => {
  return !dataStore.isUserOwner;
});

const rules: NFormRules = {
  ...rulesWebsite,
  apiKey: {
    validator: (_, value) => validateApiKey(value, websiteStore.form.apiSecret),
    message: t('validation.apiKeyRequired'),
    trigger: 'blur',
  },
  apiSecret: {
    validator: (_, value) => validateApiKey(value, websiteStore.form.apiKey),
    message: t('validation.apiSecretRequired'),
    trigger: 'blur',
  },
};

function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else {
      createDeployConfig();
    }
  });
}

async function createDeployConfig() {
  if (!dataStore.projectUuid || !websiteStore.active) return;

  loading.value = true;
  try {
    const bodyData = {
      websiteUuid: websiteStore.active.website_uuid,
      projectUuid: dataStore.projectUuid,
      ...websiteStore.form,
    };
    await $api.post<DeploymentConfigResponse>(endpoints.deployConfig, bodyData);
    message.success(t('hosting.deploy.success'));
    websiteStore.active.source = WebsiteSource.GITHUB;
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }

  loading.value = false;
}
</script>
