<template>
  <div>
    <n-space v-bind="$attrs" justify="space-between">
      <div class="w-[20vw] max-w-xs">
        <n-input
          v-model:value="dataStore.folder.search"
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
        <template v-if="isUpload && dataStore.folder.selectedItems.length > 0">
          <!-- Download files -->
          <n-tooltip :show="showPopoverDownload" placement="bottom">
            <template #trigger>
              <n-button
                class="w-10"
                size="small"
                :focus="true"
                :loading="downloading"
                @click="downloadSelectedFiles"
              >
                <span class="icon-download"></span>
              </n-button>
            </template>
            <span>{{ $t('storage.downloadSelectedFiles') }}</span>
          </n-tooltip>

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
        <n-button size="small" :loading="dataStore.folder.loading" @click="refresh">
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
          @click="deployToStaging"
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
          @click="deployToProduction"
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
          {{ $t(`storage.delete.deleteConfirm`, { num: dataStore.folder.selectedItems.length }) }}
        </p>
      </template>
      <slot>
        <FormDeleteItems :items="dataStore.folder.selectedItems" @submit-success="onDeleted" />
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
          :id="dataStore.bucket.active.id"
          type="bucketContent"
          @submit-success="onAllFilesDeleted"
        />
      </slot>
    </ModalDelete>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
const props = defineProps({
  env: { type: Number, default: 0 },
});

const $i18n = useI18n();
const router = useRouter();
const { params } = useRoute();
const message = useMessage();
const dataStore = useDataStore();
const downloading = ref<boolean>(false);
const showModalNewFolder = ref<boolean>(false);
const showModalDelete = ref<boolean>(false);
const showModalClearAll = ref<boolean>(false);
const showPopoverDelete = ref<boolean>(false);
const showPopoverDownload = ref<boolean>(false);
const deploying = ref<boolean>(false);

/** Webpage ID from route */
const webpageId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);

const isUpload = computed<Boolean>(() => {
  return (
    props.env !== DeploymentEnvironment.STAGING && props.env !== DeploymentEnvironment.PRODUCTION
  );
});

async function refresh() {
  /** Refresh hosting files */
  dataStore.fetchDirectoryContent();

  /** On tab stg/prod refresh also webpage and deployments */
  if (
    props.env === DeploymentEnvironment.STAGING ||
    props.env === DeploymentEnvironment.PRODUCTION
  ) {
    /** Refresh deyployments */
    dataStore.fetchDeployments(webpageId.value, props.env);

    /** Refresh active webpage data */
    const webpage = await dataStore.fetchWebpage(webpageId.value);

    /** Show files from staging bucket */
    if (props.env === DeploymentEnvironment.STAGING) {
      dataStore.bucket.active = webpage.stagingBucket;
      dataStore.setBucketId(webpage.stagingBucket_id);
    } else {
      dataStore.bucket.active = webpage.productionBucket;
      dataStore.setBucketId(webpage.productionBucket_id);
    }
  }
}

function onFolderCreated() {
  showModalNewFolder.value = false;

  /** Refresh directory content */
  dataStore.fetchDirectoryContent();
}

/**
 * Download
 */
async function downloadSelectedFiles() {
  if (dataStore.folder.selectedItems.length === 0) {
    showPopoverDownload.value = true;

    setTimeout(() => {
      showPopoverDownload.value = false;
    }, 3000);
    return;
  }

  const promises: Array<Promise<any>> = [];
  downloading.value = true;

  dataStore.folder.selectedItems.forEach(async item => {
    const req = downloadFile(item.CID);
    promises.push(req);
    await req;
  });

  await Promise.all(promises).then(_ => {
    downloading.value = false;
  });
}

/** Download file - get file details and download content from downloadLink */
async function downloadFile(CID?: string | null) {
  if (!CID) {
    console.warn('MISSING File CID!');
    return;
  }
  try {
    if (!(CID in dataStore.file.items)) {
      dataStore.file.items[CID] = await dataStore.fetchFileDetails(CID);
    }
    const fileDetails: FileDetails = dataStore.file.items[CID].file;
    return download(fileDetails.link, fileDetails.name);
  } catch (error: any) {
    /** Show error message */
    message.error($i18n.t('error.fileDownload'));
  }
  return null;
}

/**
 * Delete
 */
function deleteSelectedFiles() {
  if (dataStore.folder.selectedItems.length === 0) {
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
  dataStore.folder.selectedItems = [];

  setTimeout(() => {
    dataStore.fetchDirectoryContent();
  }, 300);
}

/** On all files deleted, refresh folder list */
function onAllFilesDeleted() {
  showModalClearAll.value = false;

  dataStore.folder.items = [];
  dataStore.folder.path = [];
  dataStore.folder.selected = 0;
  dataStore.folder.total = 0;
  dataStore.folderSearch();
}

/** Deploy to stg */
async function deployToStaging() {
  deploying.value = true;

  const deployment = await dataStore.deployWebpage(
    dataStore.webpage.active.id,
    DeploymentEnvironment.STAGING
  );

  /** After successfull deploy redirect to production tab */
  if (deployment) {
    setTimeout(() => {
      router.push(`/dashboard/service/hosting/${webpageId.value}/staging`);
    }, 1000);
  }

  deploying.value = false;
}

/** Deploy to prod */
async function deployToProduction() {
  deploying.value = true;

  const deployment = await dataStore.deployWebpage(
    dataStore.webpage.active.id,
    DeploymentEnvironment.PRODUCTION
  );

  /** After successfull deploy redirect to production tab */
  if (deployment) {
    setTimeout(() => {
      router.push(`/dashboard/service/hosting/${webpageId.value}/production`);
    }, 1000);
  }

  deploying.value = false;
}
</script>
