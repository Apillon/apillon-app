<template>
  <div>
    <n-space v-bind="$attrs" justify="space-between">
      <ActionsHostingWebsiteSearchFiles v-if="search" />
      <div v-else></div>

      <n-space size="large">
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
        <n-button size="medium" :loading="bucketStore.folder.loading" @click="refreshWebpage(env)">
          <span class="icon-refresh mr-2 text-xl"></span>
          {{ $t('general.refresh') }}
        </n-button>

        <!-- Clear all files -->
        <n-button
          v-if="isUpload"
          size="medium"
          type="error"
          :disabled="authStore.isAdmin()"
          ghost
          @click="showModalClearAll = true"
        >
          <span class="icon-delete mr-2 text-xl"></span>
          {{ $t('hosting.clearAll') }}
        </n-button>

        <!-- Deploy to staging -->
        <div v-if="isUpload" class="flex items-center rounded-lg bg-primary align-middle">
          <n-button
            size="medium"
            type="primary"
            :bordered="false"
            :loading="deploying"
            :disabled="authStore.isAdmin()"
            @click="deployWebsite(DeploymentEnvironment.STAGING)"
          >
            <span class="icon-deploy mr-2 text-xl"></span>
            {{ $t('hosting.deployStage') }}
          </n-button>
          <n-dropdown trigger="click" :options="deployOptions" @select="handleSelectDeploy">
            <n-button class="!p-0" size="medium" type="primary" :bordered="false">
              <span class="icon-down text-3xl"></span>
            </n-button>
          </n-dropdown>
        </div>
        <!-- Deploy to production -->
        <n-button
          v-if="env === DeploymentEnvironment.STAGING"
          size="medium"
          type="primary"
          :loading="deploying"
          :disabled="authStore.isAdmin()"
          @click="deployWebsite(DeploymentEnvironment.PRODUCTION)"
        >
          <span class="icon-deploy mr-2 text-xl"></span>
          {{ $t('hosting.deployProd') }}
        </n-button>
      </n-space>
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
  </div>
</template>

<script lang="ts" setup>
import { translateItems } from '~/lib/utils';
import { DeploymentEnvironment } from '~/lib/types/hosting';

const props = defineProps({
  env: { type: Number, default: 0 },
  search: { type: Boolean, default: true },
});

const { websiteUuid, refreshWebpage } = useHosting();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_DEPLOY);
const { subscriptionMessage } = usePayment();

const { t, te } = useI18n();
const router = useRouter();
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

const deploying = ref<boolean>(false);
const deployEnv = ref<number>(DeploymentEnvironment.STAGING);

const isUpload = computed<boolean>(() => {
  return props.env !== DeploymentEnvironment.STAGING && props.env !== DeploymentEnvironment.PRODUCTION;
});
const hasActiveDeployments = computed<boolean>(() => {
  return deploymentStore.staging.some(deployment => deployment.deploymentStatus < DeploymentStatus.SUCCESSFUL);
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

  const deployment = await deploymentStore.deploy(websiteStore.active.website_uuid, env);

  /** After successful deploy redirect to next tab */
  if (deployment && env === DeploymentEnvironment.STAGING) {
    deploymentStore.staging = [] as Array<DeploymentInterface>;
    setTimeout(() => {
      router.push(`/dashboard/service/hosting/${websiteUuid.value}/staging`);
    }, 1000);
  } else if (deployment && env >= DeploymentEnvironment.PRODUCTION) {
    deploymentStore.production = [] as Array<DeploymentInterface>;
    setTimeout(() => {
      router.push(`/dashboard/service/hosting/${websiteUuid.value}/production`);
    }, 1000);
  }

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
