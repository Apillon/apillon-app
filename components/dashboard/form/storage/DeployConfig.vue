<template>
  <n-form
    v-bind="$attrs"
    ref="formRef"
    :model="storageStore.deployConfigForm"
    :disabled="isFormDisabled"
    :rules="rules"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <n-form-item path="repoId" :label="$t('hosting.deploy.form.repository')" :label-props="{ for: 'repo' }">
      <n-select
        v-model:value="storageStore.deployConfigForm.repoId"
        :placeholder="$t('hosting.deploy.form.repository-placeholder')"
        :options="repoOptions"
        @update:value="handleUpdateValue"
      />
    </n-form-item>
    <n-form-item path="branchName" :label="$t('hosting.deploy.form.branch-name')" :label-props="{ for: 'branchName' }">
      <n-input
        v-model:value="storageStore.deployConfigForm.branchName"
        :input-props="{ id: 'branchName' }"
        :placeholder="$t('hosting.deploy.form.branch-name-placeholder')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="buildCommand"
      :label="$t('hosting.deploy.form.build-command')"
      :label-props="{ for: 'buildCommand' }"
    >
      <n-input
        v-model:value="storageStore.deployConfigForm.buildCommand"
        :input-props="{ id: 'buildCommand' }"
        :placeholder="$t('hosting.deploy.form.build-command-placeholder')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="buildDirectory"
      :label="$t('hosting.deploy.form.build-directory')"
      :label-props="{ for: 'buildDirectory' }"
    >
      <n-input
        v-model:value="storageStore.deployConfigForm.buildDirectory"
        :input-props="{ id: 'buildDirectory' }"
        :placeholder="$t('hosting.deploy.form.build-directory-placeholder')"
        clearable
      />
    </n-form-item>

    <n-form-item
      path="installCommand"
      :label="$t('hosting.deploy.form.install-command')"
      :label-props="{ for: 'installCommand' }"
    >
      <n-input
        v-model:value="storageStore.deployConfigForm.installCommand"
        :input-props="{ id: 'installCommand' }"
        :placeholder="$t('hosting.deploy.form.install-command-placeholder')"
        clearable
      />
    </n-form-item>

    <n-form-item path="apiKey" :label="$t('hosting.deploy.form.api-key')" :label-props="{ for: 'apiKey' }">
      <n-select
        v-model:value="storageStore.deployConfigForm.apiKey"
        :placeholder="$t('hosting.deploy.form.api-key-placeholder')"
        :options="apiKeyOptions"
      >
      </n-select>
    </n-form-item>

    <n-form-item path="apiSecret" :label="$t('hosting.deploy.form.api-secret')" :label-props="{ for: 'apiSecret' }">
      <n-input
        v-model:value="storageStore.deployConfigForm.apiSecret"
        :input-props="{ id: 'apiSecret', autocomplete: 'off' }"
        show-password-on="click"
        type="password"
        :placeholder="$t('hosting.deploy.form.api-secret-placeholder')"
        clearable
      />
    </n-form-item>
    <n-form-item :show-feedback="false" :show-label="false">
      <input type="submit" class="hidden" :value="'Save'" />

      <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
        {{ $t('hosting.deploy.form.save') }}
      </Btn>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const props = defineProps({
  id: { type: Number, default: 0 },
});

const $i18n = useI18n();
const message = useMessage();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();

const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess', 'close']);

const dataStore = useDataStore();
const formRef = ref<NFormInst | null>(null);
const settingsStore = useSettingsStore();
const apiKeyOptions = ref<SelectOption[]>([]);
const repoOptions = ref<SelectOption[]>([]);

const loading = ref<boolean>(false);

const isFormDisabled = computed<boolean>(() => {
  return !dataStore.isUserOwner;
});

const rules: NFormRules = {
  repoId: [ruleRequired($i18n.t('hosting.deploy.form.validation.repo-required'))],
  branchName: [ruleRequired($i18n.t('hosting.deploy.form.validation.branch-name-required'))],
  buildDirectory: [ruleRequired($i18n.t('hosting.deploy.form.validation.build-directory-required'))],
  apiKey: [ruleRequired($i18n.t('hosting.deploy.form.validation.api-key-required'))],
  apiSecret: [ruleRequired($i18n.t('hosting.deploy.form.validation.api-secret-required'))],
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
  loading.value = true;
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();

    if (!dataStore.projectUuid) return;
  }

  if (!websiteStore.active) {
    return;
  }

  try {
    const bodyData = {
      websiteUuid: websiteStore.active.website_uuid,
      ...storageStore.deployConfigForm,
    };
    const res = await $api.post<any>(endpoints.deployConfig, bodyData);
    message.success($i18n.t('hosting.deploy.form.success'));

    websiteStore.active.repoId = res.data.repoId;
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }

  loading.value = false;
}

function handleUpdateValue(value: number) {
  const repo = storageStore.repos.find((item: GithubRepo) => item.id === value);
  if (repo) {
    storageStore.deployConfigForm.repoName = repo.name;
    storageStore.deployConfigForm.repoOwnerName = repo.owner.login;
    storageStore.deployConfigForm.branchName = repo.default_branch;
  }
}

onMounted(async () => {
  await settingsStore.getApiKeys();
  await storageStore.getRepos();
  apiKeyOptions.value = settingsStore.apiKeys.map((item: ApiKeyInterface) => {
    return {
      label: item.name,
      value: item.apiKey,
    };
  });
  repoOptions.value = storageStore.repos.map((item: GithubRepo) => ({
    value: item.id,
    label: item.name,
  }));
});
</script>
