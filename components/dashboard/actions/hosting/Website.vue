<template>
  <div>
    <n-space class="w-full lg:min-w-52" size="large" vertical>
      <!-- Show only if user select files -->
      <template v-if="isUpload && bucketStore.folder.selectedItems.length > 0">
        <!-- Delete files -->
        <n-tooltip placement="bottom" :show="showPopoverDelete">
          <template #trigger>
            <n-button
              class="w-10"
              size="medium"
              type="error"
              :disabled="authStore.isAdmin()"
              ghost
              @click="deleteSelectedFiles"
            >
              <span class="icon-delete text-xl"></span>
            </n-button>
          </template>
          <span>{{ $t('storage.delete.selectedFiles') }}</span>
        </n-tooltip>

        <!-- Separator -->
        <n-divider class="mx-4 h-full" vertical />
      </template>

      <!-- Refresh -->
      <n-button class="w-full" size="medium" :loading="bucketStore.folder.loading" @click="refreshWebpage(env)">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <template v-if="websiteStore.isActiveWebsiteGithubSource">
        <!-- Clear all files -->
        <n-button
          v-if="isUpload"
          class="w-full"
          type="error"
          :disabled="authStore.isAdmin()"
          ghost
          @click="showModalClearAll = true"
        >
          <span class="icon-delete mr-2 text-xl"></span>
          {{ $t('hosting.clearAll') }}
        </n-button>

        <!-- Deploy to staging -->
        <n-button
          class="w-full"
          size="medium"
          type="primary"
          :loading="deploying"
          :disabled="authStore.isAdmin()"
          @click="deployWebsite(DeploymentEnvironment.DIRECT_TO_PRODUCTION)"
        >
          <span class="icon-deploy mr-2 text-xl"></span>
          {{ $t('hosting.deployProd') }}
        </n-button>
      </template>

      <Btn
        v-if="editDomainEnabled"
        class="locked w-full"
        :type="!websiteStore.active.domain ? 'primary' : 'secondary'"
        :bordered="false"
        :disabled="authStore.isAdmin()"
        @click="modalWebsiteDomainVisible = true"
      >
        <span v-if="websiteStore.active.domain"> {{ $t('hosting.domain.update') }}</span>
        <span v-else> {{ $t('hosting.domain.add') }}</span>
      </Btn>
      <n-tooltip v-else placement="top" :trigger="isMd ? 'hover' : 'click'">
        <template #trigger>
          <Btn type="primary" class="locked cursor-default !bg-primary/50">
            {{ $t('hosting.domain.add') }}
          </Btn>
        </template>
        <span>{{ $t('hosting.domain.editDisabled') }}</span>
      </n-tooltip>
      <!-- Generate short URL -->
      <FormStorageShortUrl
        v-if="websiteStore.active.w3ProductionLink"
        :target-url="websiteStore.active.w3ProductionLink"
        class="w-full"
      />
      <n-button v-if="websiteStore.isActiveWebsiteGithubSource" @click="showUpdateModal">
        {{ $t('hosting.deploy.updateConfig') }}
      </n-button>
    </n-space>

    <!-- Modal - Create new folder -->
    <modal v-model:show="showModalNewFolder" :title="$t('storage.directory.createNew')">
      <FormStorageDirectory @submit-success="onFolderCreated" />
    </modal>

    <!-- Modal - Delete file/folder -->
    <ModalDelete v-model:show="showModalDelete" :title="$t(`storage.delete.bucketItems`)">
      <template #content>
        <p>
          {{ $t(`storage.delete.deleteConfirm`, { num: bucketStore.folder.selectedItems.length }) }}
        </p>
      </template>
      <slot>
        <FormDeleteItems :items="bucketStore.folder.selectedItems" @submit-success="onDeleted" />
      </slot>
    </ModalDelete>

    <!-- Modal - Clear all files -->
    <ModalDelete v-model:show="showModalClearAll" :title="$t(`hosting.clearAllFiles`)">
      <template #content>
        <p v-if="te(`hosting.clearAllWarn`)" class="text-body">
          {{ $t(`hosting.clearAllWarn`) }}
        </p>
      </template>
      <slot>
        <FormDelete :id="bucketStore.active.bucket_uuid" type="bucketContent" @submit-success="onAllFilesDeleted" />
      </slot>
    </ModalDelete>

    <!-- W3Warn - Hosting deploy -->
    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalConfirm">
      {{ $t('w3Warn.hosting.deploy') }}
    </W3Warn>

    <!-- Modal - Website under review -->
    <Modal v-model:show="modalWebsiteReviewVisible" :title="$t('hosting.review.title')">
      <p v-for="(item, key) in translateItems('hosting.review.content')" :key="key">
        {{ item }}
      </p>
      <div class="mt-8 grid w-full max-w-full grid-cols-1 gap-8">
        <Btn type="secondary" @click="onModalConfirm">{{ $t('hosting.review.confirm') }}</Btn>
        <PaymentCardPlan :show-card="false" btn-type="primary" :btn-text="$t('hosting.review.upgrade')" />
      </div>
    </Modal>

    <!-- Modal -  Domain preview -->
    <Modal v-model:show="modalWebsiteDomainVisible" :title="$t('hosting.domain.edit')">
      <HostingDomain />
    </Modal>

    <modal
      v-model:show="modalGithubConfigVisible"
      :title="$t(websiteStore.isActiveWebsiteGithubSource ? 'hosting.deploy.update' : 'hosting.deploy.new')"
    >
      <FormStorageDeployConfig :config-id="deploymentStore.deploymentConfig?.id" @submit-success="handleConfigChange" />
    </modal>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  env: { type: Number, default: 0 },
});

const { isMd } = useScreen();
const { checkUnfinishedBuilds, refreshWebpage } = useHosting();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_DEPLOY);
const { subscriptionMessage } = usePayment();

const { t, te } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const paymentStore = usePaymentStore();
const warningStore = useWarningStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

const showModalNewFolder = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showModalClearAll = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const modalWebsiteReviewVisible = ref<boolean>(false);
const modalWebsiteDomainVisible = ref<boolean>(false);
const modalGithubConfigVisible = ref<boolean>(false);

const deploying = ref<boolean>(false);
const deployEnv = ref<number>(DeploymentEnvironment.STAGING);

const isUpload = computed<boolean>(() => {
  return props.env !== DeploymentEnvironment.STAGING && props.env !== DeploymentEnvironment.PRODUCTION;
});
const hasActiveDeployments = computed<boolean>(() => {
  return deploymentStore.staging.some(deployment => deployment.deploymentStatus < DeploymentStatus.SUCCESSFUL);
});
const editDomainEnabled = computed<boolean>(() => {
  const time = websiteStore.active.domainChangeDate;
  return !time || new Date(time).getTime() + 15 * 60 * 1000 < Date.now();
});

const deployOptions = ref([
  {
    label: t('hosting.deployStage'),
    key: DeploymentEnvironment.STAGING,
  },
  {
    label: t('hosting.deployProd'),
    key: DeploymentEnvironment.DIRECT_TO_PRODUCTION,
  },
]);

/** Show payment messages if user create subscription */
onMounted(async () => {
  await dataStore.waitOnPromises();
  subscriptionMessage();
});

const handleConfigChange = async () => {
  websiteStore.resetForm();
  modalGithubConfigVisible.value = false;

  setTimeout(() => checkUnfinishedBuilds(), 3000);
};

const showUpdateModal = async () => {
  if (deploymentStore.deploymentConfig) {
    Object.entries(deploymentStore.deploymentConfig).forEach(([key, value]) => {
      if (value && key in websiteStore.form) {
        websiteStore.form[key] = value;
      }
    });
  }
  modalGithubConfigVisible.value = true;
};

function handleSelectDeploy(key: number) {
  deployWebsite(key);
}

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  bucketStore.fetchDirectoryContent();
}

/**
 * Delete
 */
function deleteSelectedFiles() {
  if (bucketStore.folder.selectedItems.length === 0) {
    showPopoverDelete.value = true;

    setTimeout(() => {
      showPopoverDelete.value = false;
    }, 3000);
    return;
  }

  showModalDelete.value = true;
}

/** On folder deleted, refresh folder list */
function onDeleted() {
  showModalDelete.value = false;

  /** Reset selected items */
  bucketStore.folder.selectedItems = [];

  setTimeout(() => {
    bucketStore.fetchDirectoryContent();
  }, 300);
}

/** On all files deleted, refresh folder list */
function onAllFilesDeleted() {
  showModalClearAll.value = false;

  bucketStore.folder.items = [];
  bucketStore.folder.path = [];
  bucketStore.folder.selected = '';
  bucketStore.folderSearch();
}

/** Deploy to stg/prod */
async function deploy(env: number) {
  deploying.value = true;
  await deploymentStore.deploy(websiteStore.active.website_uuid, env);
  deploying.value = false;
}

/**
 * On createNewWebsite click
 * If W3Warn has already been shown, show modal create new website, otherwise show warn first
 * */
function deployWebsite(env: number) {
  deployEnv.value = env;
  if (bucketStore.folder.items.length === 0 && env === DeploymentEnvironment.PRODUCTION && hasActiveDeployments.value) {
    message.warning(t('validation.hosting.waitActiveDeployment'));
  } else if (bucketStore.folder.items.length === 0) {
    message.warning(t('error.NO_FILES_TO_DEPLOY'));
  } else if (websiteStore.missingHtml) {
    message.error(t('validation.hosting.missingHtml'));
  } else if (!paymentStore.hasActiveSubscription && !sessionStorage.getItem(SessionKeys.WEBSITE_REVIEW)) {
    modalWebsiteReviewVisible.value = true;
    sessionStorage.setItem(SessionKeys.WEBSITE_REVIEW, Date.now().toString());
  } else if (!localStorage.getItem(LsW3WarnKeys.HOSTING_DEPLOY) && te('w3Warn.hosting.deploy')) {
    modalW3WarnVisible.value = true;
  } else {
    warningStore.showSpendingWarning(getPricingServiceName(env), () => deploy(env));
  }
}

/** When user close W3Warn, allow him to create new website */
function onModalConfirm() {
  warningStore.showSpendingWarning(getPricingServiceName(deployEnv.value), () => deploy(deployEnv.value));
}

function getPricingServiceName(env: number) {
  return env === DeploymentEnvironment.STAGING
    ? PriceServiceName.HOSTING_DEPLOY_TO_STAGING
    : PriceServiceName.HOSTING_DEPLOY_TO_PRODUCTION;
}
</script>
