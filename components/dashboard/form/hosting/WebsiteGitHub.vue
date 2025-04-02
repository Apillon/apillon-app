<template>
  <div v-if="!repoSelected" class="mx-auto max-w-5xl">
    <!-- Info text -->
    <h5 v-if="title" class="mb-2">{{ title }}</h5>
    <p v-if="$te('hosting.website.infoNewGithub')" class="mb-8 text-body">
      {{ $t('hosting.website.infoNewGithub') }}
    </p>
    <div class="my-8 flex flex-col gap-4 md:flex-row">
      <div class="card p-8 md:w-1/2">
        <h5>Import existing Git Repository</h5>
        <FormFieldRepo v-model:value="websiteStore.form.repoId" />
      </div>
      <div class="card p-8 md:w-1/2">2</div>
    </div>
  </div>
  <div v-else class="mx-auto max-w-lg">
    <!-- Permissions Error Notification -->
    <Notification v-if="isFormDisabled" type="error" class="mb-8 w-full">
      {{ $t('dashboard.permissions.insufficient') }}
    </Notification>

    <n-form
      ref="formRef"
      :model="websiteStore.form"
      :rules="rules"
      :disabled="isFormDisabled"
      @submit.prevent="handleSubmit"
    >
      <n-form-item path="name" :label="$t('form.label.website.name')" :label-props="{ for: 'name' }">
        <n-input
          v-model:value="websiteStore.form.name"
          :input-props="{ id: 'name' }"
          :placeholder="$t('form.placeholder.website.name')"
          clearable
        />
      </n-form-item>

      <!-- GitHub Specific Fields -->
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

      <FormFieldApiKey
        :api-key="websiteStore.form.apiKey"
        :api-secret="websiteStore.form.apiSecret"
        @update:api-key="apiKey => (websiteStore.form.apiKey = apiKey)"
        @update:api-secret="apiSecret => (websiteStore.form.apiSecret = apiSecret)"
      />

      <!-- Submit Button -->
      <n-form-item v-if="!hideSubmit" :show-feedback="false">
        <Btn type="primary" class="mt-2 w-full" :loading="loading" :disabled="isFormDisabled" @click="handleSubmit">
          {{ website ? $t('hosting.website.update') : $t('hosting.website.create') }}
        </Btn>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
defineExpose({ back, handleSubmit });
const emit = defineEmits(['back', 'submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  title: { type: String, default: null },
  hideSubmit: { type: Boolean, default: false },
});

const { t } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const warningStore = useWarningStore();
const { rulesWebsite, createWebsite } = useHosting();

const loading = ref<boolean>(false);
const repoSelected = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);

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

const isFormDisabled = computed<boolean>(() => {
  return dataStore.isProjectUser;
});

function back() {
  if (repoSelected.value) {
    repoSelected.value = false;
  } else {
    emit('back');
  }
}

// Submit
async function handleSubmit(e?: Event | MouseEvent) {
  e?.preventDefault();

  if (!repoSelected.value) {
    if (!websiteStore.form.repoId) {
      message.error(t('validation.hosting.repoRequired'));
    } else {
      repoSelected.value = true;
    }
  } else {
    const validation = await formRef.value?.validate((errors: Array<NFormValidationError> | undefined) => {
      errors?.map(fieldErrors => fieldErrors.map(error => message.warning(error.message || 'Error')));
    });

    if (props.hideSubmit) {
      return !validation?.warnings;
    } else {
      warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => createWebsite());
    }
  }
}
</script>
