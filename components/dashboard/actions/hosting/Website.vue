<template>
  <div>
    <n-space v-bind="$attrs" justify="space-between">
      <div class="w-[20vw] max-w-xs">
        <n-input
          v-model:value="bucketStore.folder.search"
          type="text"
          name="search"
          size="small"
          :placeholder="$t('storage.file.search')"
          clearable
        >
          <template #prefix>
            <span class="icon-search text-2xl"></span>
          </template>
        </n-input>
      </div>

      <n-space size="large">
        <!-- Show only if user select files -->
        <template v-if="isUpload && bucketStore.folder.selectedItems.length > 0">
          <!-- Download files -->
          <n-button
            class="w-10"
            size="small"
            :focus="true"
            :loading="downloading"
            @click="downloadSelectedFiles"
          >
            <span class="icon-download text-xl"></span>
          </n-button>

          <!-- Delete files -->
          <n-tooltip placement="bottom" :show="showPopoverDelete">
            <template #trigger>
              <n-button
                class="w-10"
                size="small"
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
          <n-divider class="h-full mx-4" vertical />
        </template>

        <!-- Refresh -->
        <n-button size="small" :loading="bucketStore.folder.loading" @click="refreshWebpage(env)">
          <span class="icon-refresh text-xl mr-2"></span>
          {{ $t('general.refresh') }}
        </n-button>

        <!-- Create folder
        <n-button
          v-if="isUpload"
          size="small"
          :disabled="authStore.isAdmin()"
          @click="showModalNewFolder = true"
        >
          <span class="icon-create-folder text-xl mr-2"></span>
          {{ $t('storage.directory.create') }}
        </n-button> -->

        <!-- Clear all files -->
        <n-button
          v-if="isUpload"
          size="small"
          type="error"
          :disabled="authStore.isAdmin()"
          ghost
          @click="showModalClearAll = true"
        >
          <span class="icon-delete text-xl mr-2"></span>
          {{ $t('hosting.clearAll') }}
        </n-button>

        <!-- Deploy to staging -->
        <div v-if="isUpload" class="flex items-center align-middle bg-primary rounded-lg">
          <n-button
            size="small"
            type="primary"
            :bordered="false"
            :loading="deploying"
            :disabled="authStore.isAdmin()"
            @click="deployWebsite(DeploymentEnvironment.STAGING)"
          >
            <span class="icon-deploy text-xl mr-2"></span>
            {{ $t('hosting.deployStage') }}
          </n-button>
          <n-dropdown trigger="click" :options="deployOptions" @select="handleSelectDeploy">
            <n-button class="!p-0" size="small" type="primary" :bordered="false">
              <span class="icon-down text-3xl"></span>
            </n-button>
          </n-dropdown>
        </div>
        <!-- Deploy to production -->
        <n-button
          v-if="env === DeploymentEnvironment.STAGING"
          size="small"
          type="primary"
          :loading="deploying"
          :disabled="authStore.isAdmin()"
          @click="deployWebsite(DeploymentEnvironment.PRODUCTION)"
        >
          <span class="icon-deploy text-xl mr-2"></span>
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
        <p class="text-body">
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
        <p v-if="$i18n.te(`hosting.clearAllWarn`)" class="text-body">
          {{ $t(`hosting.clearAllWarn`) }}
        </p>
      </template>
      <slot>
        <FormDelete
          :id="bucketStore.active.bucket_uuid"
          type="bucketContent"
          @submit-success="onAllFilesDeleted"
        />
      </slot>
    </ModalDelete>

    <!-- W3Warn - Hosting deploy -->
    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnHide">
      {{ $t('w3Warn.hosting.deploy') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  env: { type: Number, default: 0 },
});

const { downloading, downloadSelectedFiles } = useFile();
const { websiteUuid, refreshWebpage } = useHosting();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_DEPLOY);

const $i18n = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const bucketStore = useBucketStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const warningStore = useWarningStore();

const showModalNewFolder = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showModalClearAll = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const deploying = ref<boolean>(false);
const deployEnv = ref<number>(DeploymentEnvironment.STAGING);

const isUpload = computed<Boolean>(() => {
  return (
    props.env !== DeploymentEnvironment.STAGING && props.env !== DeploymentEnvironment.PRODUCTION
  );
});

const deployOptions = ref([
  {
    label: $i18n.t('hosting.deployStage'),
    key: DeploymentEnvironment.STAGING,
  },
  {
    label: $i18n.t('hosting.deployProd'),
    key: DeploymentEnvironment.DIRECT_TO_PRODUCTION,
  },
]);
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
  bucketStore.folder.total = 0;
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
  if (bucketStore.folder.items.length === 0) {
    message.warning($i18n.t('error.NO_FILES_TO_DEPLOY'));
  } else if (
    localStorage.getItem(LsW3WarnKeys.HOSTING_DEPLOY) ||
    !$i18n.te('w3Warn.hosting.deploy')
  ) {
    warningStore.showSpendingWarning(getPricingServiceName(env), () => deploy(env));
  } else {
    modalW3WarnVisible.value = true;
  }
}

/** When user close W3Warn, allow him to create new website */
function onModalW3WarnHide() {
  warningStore.showSpendingWarning(getPricingServiceName(deployEnv.value), () =>
    deploy(deployEnv.value)
  );
}

function getPricingServiceName(env: number) {
  return env === DeploymentEnvironment.STAGING
    ? PriceServiceName.HOSTING_DEPLOY_TO_STAGING
    : PriceServiceName.HOSTING_DEPLOY_TO_PRODUCTION;
}
</script>
