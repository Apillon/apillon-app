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
            <span class="icon-search text-xl"></span>
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
            <span class="icon-download"></span>
          </n-button>

          <!-- Delete files -->
          <n-tooltip placement="bottom" :show="showPopoverDelete">
            <template #trigger>
              <n-button class="w-10" size="small" :active="true" @click="deleteSelectedFiles">
                <span class="icon-delete text-pink"></span>
              </n-button>
            </template>
            <span>{{ $t('storage.delete.selectedFiles') }}</span>
          </n-tooltip>

          <!-- Separator -->
          <n-divider class="h-full mx-4" vertical />
        </template>

        <!-- Refresh -->
        <n-button size="small" :loading="bucketStore.folder.loading" @click="refresh">
          <span class="icon-refresh text-lg mr-2"></span>
          {{ $t('general.refresh') }}
        </n-button>

        <!-- Create folder -->
        <n-button v-if="isUpload" size="small" @click="showModalNewFolder = true">
          <span class="icon-create-folder text-lg mr-2"></span>
          {{ $t('storage.directory.create') }}
        </n-button>

        <!-- Clear all files -->
        <n-button v-if="isUpload" size="small" type="error" ghost @click="showModalClearAll = true">
          <span class="icon-delete text-lg mr-2"></span>
          {{ $t('hosting.clearAll') }}
        </n-button>

        <!-- Deploy to staging -->
        <n-button
          v-if="isUpload"
          size="small"
          type="primary"
          :loading="deploying"
          @click="deploy(DeploymentEnvironment.STAGING)"
        >
          <span class="icon-deploy text-lg mr-2"></span>
          {{ $t('hosting.deployStage') }}
        </n-button>
        <!-- Deploy to production -->
        <n-button
          v-if="env === DeploymentEnvironment.STAGING"
          size="small"
          type="primary"
          :loading="deploying"
          @click="deploy(DeploymentEnvironment.PRODUCTION)"
        >
          <span class="icon-deploy text-lg mr-2"></span>
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
          :id="bucketStore.active.id"
          type="bucketContent"
          @submit-success="onAllFilesDeleted"
        />
      </slot>
    </ModalDelete>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  env: { type: Number, default: 0 },
});

const { downloading, downloadSelectedFiles } = useFile();
const $i18n = useI18n();
const router = useRouter();
const { params } = useRoute();
const bucketStore = useBucketStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();

const showModalNewFolder = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showModalClearAll = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const deploying = ref<boolean>(false);

/** Website ID from route */
const websiteId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);

const isUpload = computed<Boolean>(() => {
  return (
    props.env !== DeploymentEnvironment.STAGING && props.env !== DeploymentEnvironment.PRODUCTION
  );
});

async function refresh() {
  /** Refresh hosting files */
  bucketStore.fetchDirectoryContent();

  /** On tab stg/prod refresh also website and deployments */
  if (
    props.env === DeploymentEnvironment.STAGING ||
    props.env === DeploymentEnvironment.PRODUCTION
  ) {
    /** Refresh deyployments */
    deploymentStore.fetchDeployments(websiteId.value, props.env);

    /** Refresh active website data */
    const website = await websiteStore.fetchWebsite(websiteId.value);

    /** Show files from staging bucket */
    if (props.env === DeploymentEnvironment.STAGING) {
      bucketStore.active = website.stagingBucket;
      bucketStore.setBucketId(website.stagingBucket.id);
    } else {
      bucketStore.active = website.productionBucket;
      bucketStore.setBucketId(website.productionBucket.id);
    }
  }
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
  bucketStore.folder.selected = 0;
  bucketStore.folder.total = 0;
  bucketStore.folderSearch();
}

/** Deploy to stg/prod */
async function deploy(env: number) {
  deploying.value = true;

  const deployment = await deploymentStore.deploy(websiteStore.active.id, env);

  /** After successfull deploy redirect to next tab */
  if (deployment && env === DeploymentEnvironment.STAGING) {
    deploymentStore.staging = [] as Array<DeploymentInterface>;
    setTimeout(() => {
      router.push(`/dashboard/service/hosting/${websiteId.value}/staging`);
    }, 1000);
  }
  if (deployment && env === DeploymentEnvironment.PRODUCTION) {
    deploymentStore.production = [] as Array<DeploymentInterface>;
    setTimeout(() => {
      router.push(`/dashboard/service/hosting/${websiteId.value}/production`);
    }, 1000);
  }

  deploying.value = false;
}
</script>
