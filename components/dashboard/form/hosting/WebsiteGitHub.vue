<template>
  <div v-if="!repoSelected" class="mx-auto max-w-5xl">
    <!-- Info text -->
    <h5 v-if="title" class="mb-2">{{ title }}</h5>
    <p v-if="$te('hosting.website.infoNewGithub')" class="mb-8 text-body">
      {{ $t('hosting.website.infoNewGithub') }}
    </p>
    <div class="my-8 flex flex-col gap-4 md:flex-row">
      <div class="card p-4 md:w-1/2 md:p-6 lg:p-8">
        <h6 class="mb-2">{{ $t('hosting.github.import') }}</h6>
        <p class="mb-4 mt-2">{{ $t('hosting.github.importInfo') }}</p>
        <StorageGithubProjectConfig v-if="!storageStore.projectConfig" />
        <FormFieldRepo v-else v-model:value="websiteStore.form.repoId" />
      </div>
      <HostingCardTemplates class="md:w-1/2" @select-repo="repoSelected = true" />
    </div>
  </div>

  <FormNftWebsiteDeploy
    v-else-if="isApillonRepo && websiteStore.form.repoId"
    ref="formNftWebsiteRef"
    class="mx-auto max-w-lg"
    :template-type="websiteStore.form.repoId"
    hide-submit
  />
  <Form v-else class="mx-auto max-w-lg">
    <n-form
      ref="formRef"
      :model="websiteStore.form"
      :rules="rulesWebsite"
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
      <n-form-item
        v-if="selectedRepo"
        path="repoId"
        :label="$t('form.label.website.repository')"
        :label-props="{ for: 'repo' }"
      >
        <div class="card-border flex w-full items-center justify-between rounded-lg px-4 py-[6px]">
          <span class="flex items-center gap-1 text-xs">
            <img :src="selectedRepo.owner.avatar_url" alt="" class="h-6 w-6 rounded-lg" />
            <span class="capitalize">{{ selectedRepo.name.replaceAll('-', ' ') }}</span>
            <small class="text-[10px]">{{ dateTimeToMonthDay(selectedRepo.updated_at) }}</small>
          </span>
          <Btn class="float-right mt-[2px] text-xs text-yellow" type="link" @click="repoSelected = false">
            {{ $t('general.change') }}
          </Btn>
        </div>
      </n-form-item>
      <FormFieldRepo v-else v-model:value="websiteStore.form.repoId" />

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
  </Form>
</template>

<script lang="ts" setup>
defineExpose({ back, handleSubmit });
const emit = defineEmits(['back', 'next', 'submitSuccess', 'createSuccess', 'updateSuccess']);
const props = defineProps({
  title: { type: String, default: null },
  hideSubmit: { type: Boolean, default: false },
});
const formNftWebsiteRef = useTemplateRef('formNftWebsiteRef');
const message = useMessage();
const dataStore = useDataStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { t } = useI18n();
const { rulesWebsite } = useForm();
const { createWebsite } = useHosting();

const loading = ref<boolean>(false);
const repoSelected = ref<boolean>(false);
const formRef = ref<NFormInst | null>(null);
const website = ref<WebsiteInterface | null>(null);

const isApillonRepo = computed<boolean>(() => apillonRepos.some(r => r.id === websiteStore.form.repoId));
const isFormDisabled = computed<boolean>(() => dataStore.isProjectUser);
const selectedRepo = computed(() =>
  [...storageStore.repos, ...apillonRepos].find(r => r.id === websiteStore.form.repoId)
);

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
  } else if (isApillonRepo.value) {
    const result = await formNftWebsiteRef.value?.handleSubmit();
    const collection = collectionStore.items.find(c => c.collection_uuid === result?.nftCollection);

    websiteStore.form.name = `${collection?.name} - Website`;
    websiteStore.form.apiKey = result?.apiKey;
    websiteStore.form.apiSecret = result?.apiSecret;
    websiteStore.form.embeddedWallet = result?.embeddedWallet || '';
    websiteStore.form.nftCollection = result?.nftCollection || '';
    websiteStore.form.templateType = result?.type || 1;
    return props.hideSubmit ? !!result : null;
  } else {
    const validation = await formRef.value?.validate();
    if (props.hideSubmit) {
      return !validation?.warnings;
    } else {
      warningStore.showSpendingWarning(PriceServiceName.HOSTING_WEBSITE, () => createWebsite());
    }
  }
}
</script>
