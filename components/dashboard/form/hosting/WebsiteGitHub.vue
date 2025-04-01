<template>
  <div>
    <!-- Permissions Error Notification -->
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <!-- Info text -->
    <h5 v-if="title" class="mb-2">{{ title }}</h5>
    <p v-if="$te('hosting.website.infoNewGithub')" class="mb-8 text-body">
      {{ $t('hosting.website.infoNewGithub') }}
    </p>

    <n-form
      ref="formRef"
      :model="websiteStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <n-form-item path="name" :label="$t('form.label.websiteName')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="websiteStore.form.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.websiteName')"
          clearable
        />
      </n-form-item>

      <!-- GitHub Specific Fields -->
      <n-form-item path="repoId" :label="$t('hosting.deploy.form.repository')" :label-props="{ for: 'repo' }">
        <n-select
          v-model:value="websiteStore.form.repoId"
          :placeholder="$t('hosting.deploy.form.repository-placeholder')"
          :options="repoOptions"
          @update:value="handleUpdateValue"
        />
      </n-form-item>
      <n-form-item
        path="branchName"
        :label="$t('hosting.deploy.form.branch-name')"
        :label-props="{ for: 'branchName' }"
      >
        <n-input
          v-model:value="websiteStore.form.branchName"
          :input-props="{ id: 'branchName' }"
          :placeholder="$t('hosting.deploy.form.branch-name-placeholder')"
          clearable
        />
      </n-form-item>

      <n-form-item
        path="installCommand"
        :label="$t('hosting.deploy.form.install-command')"
        :label-props="{ for: 'installCommand' }"
      >
        <n-input
          v-model:value="websiteStore.form.installCommand"
          :input-props="{ id: 'installCommand' }"
          :placeholder="$t('hosting.deploy.form.install-command-placeholder')"
          clearable
        />
      </n-form-item>

      <n-form-item
        path="buildCommand"
        :label="$t('hosting.deploy.form.build-command')"
        :label-props="{ for: 'buildCommand' }"
      >
        <n-input
          v-model:value="websiteStore.form.buildCommand"
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
          v-model:value="websiteStore.form.buildDirectory"
          :input-props="{ id: 'buildDirectory' }"
          :placeholder="$t('hosting.deploy.form.build-directory-placeholder')"
          clearable
        />
      </n-form-item>

      <n-collapse accordion>
        <n-collapse-item>
          <template #header>
            {{ $t('nft.collection.website-deploy.form.advanced-settings') }}
          </template>
          <n-form-item path="apiKey" :label="$t('hosting.deploy.form.api-key')" :label-props="{ for: 'apiKey' }">
            <n-select
              v-model:value="websiteStore.form.apiKey"
              :placeholder="$t('hosting.deploy.form.api-key-placeholder')"
              :options="apiKeyOptions"
            >
            </n-select>
          </n-form-item>

          <n-form-item
            path="apiSecret"
            :label="$t('hosting.deploy.form.api-secret')"
            :label-props="{ for: 'apiSecret' }"
          >
            <n-input
              v-model:value="websiteStore.form.apiSecret"
              :input-props="{ id: 'apiSecret', autocomplete: 'off' }"
              show-password-on="click"
              type="password"
              :placeholder="$t('hosting.deploy.form.api-secret-placeholder')"
              clearable
            />
          </n-form-item>
        </n-collapse-item>
      </n-collapse>

      <!-- Submit Button -->
      <n-form-item :show-feedback="false">
        <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
          {{ website ? $t('hosting.website.update') : $t('hosting.website.create') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

defineExpose({ handleSubmit });
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  title: { type: String, default: null },
  hideSubmit: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const storageStore = useStorageStore();
const warningStore = useWarningStore();
const settingsStore = useSettingsStore();
const { createWebsite } = useHosting();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);
const apiKeyOptions = ref<SelectOption[]>([]);
const repoOptions = ref<SelectOption[]>([]);

const rules: NFormRules = {
  name: [ruleRequired(t('validation.websiteNameRequired'))],
  description: [ruleDescription(t('validation.descriptionTooLong'))],
  repoId: [ruleRequired(t('hosting.deploy.form.validation.repo-required'))],
  branchName: [ruleRequired(t('hosting.deploy.form.validation.branch-name-required'))],
  buildDirectory: [ruleRequired(t('hosting.deploy.form.validation.build-directory-required'))],
  apiKey: [
    {
      validator(_, value) {
        if (!value && websiteStore.form.apiSecret) {
          return new Error(t('nft.collection.website-deploy.form.api-key-equired'));
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
  apiSecret: [
    {
      validator(_, value) {
        const apiKey = websiteStore.form.apiKey;
        if (!value && apiKey) {
          return new Error(t('nft.collection.website-deploy.form.api-secret-required'));
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
};

onMounted(async () => {
  await storageStore.getGithubProjectConfig();
  if (storageStore.projectConfig) {
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
  }
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

// Submit
async function handleSubmit(e?: Event | MouseEvent) {
  e?.preventDefault();

  const validation = await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
    errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
  });

  if (props.hideSubmit) {
    return !validation?.warnings;
  } else {
    warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => createWebsite());
  }
}

function handleUpdateValue(value: number) {
  const repo = storageStore.repos.find((item: GithubRepo) => item.id === value);
  if (repo) {
    websiteStore.form.repoName = repo.name;
    websiteStore.form.branchName = repo.default_branch;
    websiteStore.form.repoOwnerName = repo.owner.login;
    websiteStore.form.repoUrl = repo.clone_url;
  }
}
</script>
