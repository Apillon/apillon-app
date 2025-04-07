<template>
  <div>
    <!-- Spinner while loading -->
    <Spinner v-if="websiteUuid && !website" />

    <div v-else>
      <!-- Permissions Error Notification -->
      <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
        {{ $t('dashboard.permissions.insufficient') }}
      </Notification>

      <!-- Website Type Selection Step -->
      <template v-if="!selectedWebsiteType">
        <h4 class="mb-6 text-center">{{ $t('hosting.website.selectType') }}</h4>
        <div class="grid grid-cols-2 gap-4">
          <div
            class="hover:bg-gray-100 cursor-pointer rounded-lg border p-6 transition-colors"
            @click="selectWebsiteType('basic')"
          >
            <h5 class="mb-2"><span class="icon-file -ml-1 mr-2"></span>{{ $t('hosting.website.basicType') }}</h5>
            <p class="text-gray-600">{{ $t('hosting.website.basicTypeDescription') }}</p>
          </div>
          <div
            class="hover:bg-gray-100 cursor-pointer rounded-lg border p-6 transition-colors"
            @click="selectWebsiteType('github')"
          >
            <h5 class="mb-2"><span class="icon-github -ml-1 mr-2"></span>{{ $t('hosting.website.githubType') }}</h5>
            <p class="text-gray-600">{{ $t('hosting.website.githubTypeDescription') }}</p>
          </div>
        </div>
      </template>

      <!-- Basic Website Form -->
      <template v-else-if="selectedWebsiteType === 'basic'">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          :disabled="isFormDisabled"
          @submit.prevent="handleSubmit"
        >
          <!-- Existing form items for basic website -->
          <n-form-item path="name" :label="$t('form.label.websiteName')" :label-props="{ for: 'name' }">
            <n-input
              v-model:value="formData.name"
              :input-props="{ id: 'name' }"
              :placeholder="$t('form.placeholder.websiteName')"
              clearable
            />
          </n-form-item>

          <n-form-item
            path="description"
            :label="$t('form.label.websiteDescription')"
            :label-props="{ for: 'description' }"
          >
            <n-input
              v-model:value="formData.description"
              type="textarea"
              :input-props="{ id: 'description' }"
              :placeholder="$t('form.placeholder.websiteDescription')"
              clearable
            />
          </n-form-item>

          <!-- Submit Button -->
          <div class="flex justify-between gap-2">
            <Btn type="secondary" @click="selectedWebsiteType = null">
              {{ $t('form.goBack') }}
            </Btn>
            <Btn class="flex-1" type="primary" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
              {{ website ? $t('hosting.website.update') : $t('hosting.website.create') }}
            </Btn>
          </div>
        </n-form>
      </template>

      <!-- GitHub Website Form -->
      <template v-else-if="selectedWebsiteType === 'github'">
        <n-form
          v-if="storageStore.projectConfig"
          ref="githubFormRef"
          :model="formData"
          :rules="githubRules"
          :disabled="isFormDisabled"
          @submit.prevent="handleSubmit"
        >
          <n-form-item path="name" :label="$t('form.label.websiteName')" :label-props="{ for: 'name' }">
            <n-input
              v-model:value="formData.name"
              :input-props="{ id: 'name' }"
              :placeholder="$t('form.placeholder.websiteName')"
              clearable
            />
          </n-form-item>

          <n-form-item
            path="description"
            :label="$t('form.label.websiteDescription')"
            :label-props="{ for: 'description' }"
          >
            <n-input
              v-model:value="formData.description"
              type="textarea"
              :input-props="{ id: 'description' }"
              :placeholder="$t('form.placeholder.websiteDescription')"
              clearable
            />
          </n-form-item>
          <!-- GitHub Specific Fields -->
          <n-form-item path="repoId" :label="$t('hosting.deploy.form.repository')" :label-props="{ for: 'repo' }">
            <n-select
              v-model:value="formData.repoId"
              :placeholder="$t('hosting.deploy.form.repository-placeholder')"
              :options="repoOptions"
              filterable
              @update:value="handleUpdateValue"
            />
          </n-form-item>
          <n-form-item
            path="branchName"
            :label="$t('hosting.deploy.form.branch-name')"
            :label-props="{ for: 'branchName' }"
          >
            <n-input
              v-model:value="formData.branchName"
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
              v-model:value="formData.buildCommand"
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
              v-model:value="formData.buildDirectory"
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
              v-model:value="formData.installCommand"
              :input-props="{ id: 'installCommand' }"
              :placeholder="$t('hosting.deploy.form.install-command-placeholder')"
              clearable
            />
          </n-form-item>

          <n-collapse class="mb-6" accordion>
            <n-collapse-item>
              <template #header>
                {{ $t('nft.collection.website-deploy.form.advanced-settings') }}
              </template>
              <n-form-item path="apiKey" :label="$t('hosting.deploy.form.api-key')" :label-props="{ for: 'apiKey' }">
                <n-select
                  v-model:value="formData.apiKey"
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
                  v-model:value="formData.apiSecret"
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
          <div class="flex justify-between gap-2">
            <Btn type="secondary" @click="selectedWebsiteType = null">
              {{ $t('form.goBack') }}
            </Btn>
            <Btn type="primary" class="flex-1" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
              {{ website ? $t('hosting.website.update') : $t('hosting.website.create') }}
            </Btn>
          </div>
        </n-form>
        <div v-else class="my-8 text-center">
          <StorageGithubProjectConfig class="locked" size="small" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

type WebsiteType = 'basic' | 'github' | null;

type FormWebsite = {
  name: string;
  description: string;
  branchName: string;
  buildCommand: string;
  buildDirectory: string;
  installCommand: string;
  apiKey?: string;
  apiSecret?: string;
  repoId?: number;
  repoName?: string;
  repoOwnerName?: string;
  repoUrl: string;
};

const props = defineProps({
  websiteUuid: { type: String, default: null },
});
const emit = defineEmits(['submitSuccess', 'createSuccess', 'updateSuccess']);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const storageStore = useStorageStore();
const warningStore = useWarningStore();
const settingsStore = useSettingsStore();

const loading = ref(false);
const formRef = ref<NFormInst | null>(null);
const githubFormRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);
const selectedWebsiteType = ref<WebsiteType>(null);
const apiKeyOptions = ref<SelectOption[]>([]);
const repoOptions = ref<SelectOption[]>([]);

const formData = ref<FormWebsite>({
  name: website.value?.name || '',
  description: website.value?.description || '',
  branchName: 'main',
  buildCommand: 'npm run build',
  buildDirectory: './out',
  installCommand: 'npm install',
  apiKey: undefined,
  apiSecret: '',
  repoId: undefined,
  repoName: '',
  repoOwnerName: '',
  repoUrl: '',
});

const rules: NFormRules = {
  name: [ruleRequired($i18n.t('validation.websiteNameRequired'))],
  description: [ruleDescription($i18n.t('validation.descriptionTooLong'))],
};

const githubRules: NFormRules = {
  ...rules,
  repoId: [ruleRequired($i18n.t('hosting.deploy.form.validation.repo-required'))],
  branchName: [ruleRequired($i18n.t('hosting.deploy.form.validation.branch-name-required'))],
  buildDirectory: [ruleRequired($i18n.t('hosting.deploy.form.validation.build-directory-required'))],
  apiKey: [
    {
      validator(_, value) {
        const apiSecret = formData.value.apiSecret;
        if (!value && apiSecret) {
          return new Error($i18n.t('nft.collection.website-deploy.form.api-key-equired'));
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
  apiSecret: [
    {
      validator(_, value) {
        const apiKey = formData.value.apiKey;
        if (!value && apiKey) {
          return new Error($i18n.t('nft.collection.website-deploy.form.api-secret-required'));
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
};

onMounted(async () => {
  if (props.websiteUuid) {
    website.value = await websiteStore.getWebsite(props.websiteUuid);
    formData.value.name = website.value.name;
    formData.value.description = website.value.description || '';

    // Determine website type based on existing data
  }
  await storageStore.getGithubProjectConfig();
  if (!storageStore.projectConfig || props.websiteUuid) {
    selectedWebsiteType.value = 'basic';
  } else {
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
  }
});

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

function selectWebsiteType(type: WebsiteType) {
  selectedWebsiteType.value = type;
}

// Submit
function handleSubmit(e: Event | MouseEvent) {
  e.preventDefault();

  const currentFormRef = selectedWebsiteType.value === 'github' ? githubFormRef : formRef;

  currentFormRef.value?.validate(async (errors: Array<NFormValidationError> | undefined) => {
    if (errors) {
      console.log(errors);
      errors.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    } else if (props.websiteUuid) {
      await updateWebsite();
    } else {
      warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => createWebsite());
    }
  });
}

async function createWebsite() {
  loading.value = true;

  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }
  const formDataValue = formData.value;
  try {
    const bodyData = {
      name: formDataValue.name,
      description: formDataValue.description,
      project_uuid: dataStore.projectUuid,

      deploymentConfig: undefined as
        | {
            branchName: string;
            buildCommand: string;
            buildDirectory: string;
            installCommand: string;
            projectUuid: string;
            apiKey?: string;
            apiSecret?: string;
            repoId?: number;
            repoName?: string;
            repoOwnerName?: string;
            repoUrl: string;
          }
        | undefined,
    };

    if (selectedWebsiteType.value === 'github') {
      bodyData.deploymentConfig = {
        branchName: formDataValue.branchName,
        buildCommand: formDataValue.buildCommand,
        buildDirectory: formDataValue.buildDirectory,
        installCommand: formDataValue.installCommand,
        repoUrl: formDataValue.repoUrl,
        apiKey: formDataValue.apiKey,
        apiSecret: formDataValue.apiSecret,
        repoId: formDataValue.repoId,
        repoName: formDataValue.repoName,
        repoOwnerName: formDataValue.repoOwnerName,
        projectUuid: dataStore.projectUuid,
      };
    }

    const res = await $api.post<WebsiteResponse>(endpoints.website, bodyData);

    message.success($i18n.t('form.success.created.website'));

    /** On new website created add new website to list */
    websiteStore.items.push(res.data as WebsiteBaseInterface);

    /** Emit events */
    emit('submitSuccess');
    emit('createSuccess');

    /** Redirect to new web page */
    router.push(
      `/dashboard/service/hosting/${res.data.website_uuid}${selectedWebsiteType.value === 'github' ? '/deployments' : ''}`
    );
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function updateWebsite() {
  loading.value = true;

  try {
    const res = await $api.patch<WebsiteResponse>(endpoints.websites(props.websiteUuid), formData.value);

    message.success($i18n.t('form.success.updated.website'));

    /** On website updated refresh website data */
    websiteStore.items.forEach((item: WebsiteBaseInterface) => {
      if (item.website_uuid === props.websiteUuid) {
        item.name = res.data.name;
        item.description = res.data.description;
      }
    });
    if (websiteStore.active.website_uuid === props.websiteUuid) {
      websiteStore.active.name = res.data.name;
      websiteStore.active.description = res.data.description;
    }

    /** Emit events */
    emit('submitSuccess');
    emit('updateSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

function handleUpdateValue(value: number) {
  const repo = storageStore.repos.find((item: GithubRepo) => item.id === value);
  if (repo) {
    formData.value.repoName = repo.name;
    formData.value.branchName = repo.default_branch;
    formData.value.repoOwnerName = repo.owner.login;
    formData.value.repoUrl = repo.clone_url;
  }
}
</script>
