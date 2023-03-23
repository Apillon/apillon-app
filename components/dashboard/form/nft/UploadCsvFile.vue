<template>
  <n-space class="pb-8" :size="32" vertical>
    <template v-if="collectionStore.hasCsvFile">
      <n-data-table :columns="collectionStore.csvColumns" :data="collectionStore.csvData" />
      <n-space justify="space-between">
        <div>
          <Notification v-if="!isSameNumOfRows" type="warning">
            {{ $t('nft.validation.csvMissingData') }}
            ( {{ collectionStore.active?.maxSupply }} )
          </Notification>
          <Notification v-else-if="!hasRequiredMetadata" type="error">
            {{ $t('nft.validation.csvRequiredColumns') }}
            {{ metadataRequired.join(',') }}
          </Notification>
        </div>
        <n-space justify="end">
          <n-upload
            :show-file-list="false"
            accept=".csv, application/vnd.ms-excel"
            :custom-request="uploadFileRequest"
          >
            <Btn type="secondary">
              {{ $t('nft.upload.differentFile') }}
            </Btn>
          </n-upload>
          <Btn
            type="primary"
            :disabled="!collectionStore.hasCsvFile || !isCsvValid"
            @click="modalMetadataAttributesVisible = true"
          >
            {{ $t('nft.upload.csvConfirm') }}
          </Btn>
        </n-space>
      </n-space>
    </template>
    <n-upload
      v-else
      :show-file-list="false"
      accept=".csv, application/vnd.ms-excel"
      :custom-request="uploadFileRequest"
    >
      <n-upload-dragger style="height: calc(100vh - 420px)">
        <div class="py-2 text-center">
          <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
            <span class="icon-upload text-violet text-2xl"></span>
          </div>

          <h4 class="mb-1">{{ $t('nft.upload.csvFile') }}</h4>
          <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
        </div>
      </n-upload-dragger>
    </n-upload>
  </n-space>
  <modal v-model:show="modalMetadataAttributesVisible" :title="$t('nft.upload.attributes')">
    <n-space class="pb-8" :size="32" vertical>
      <NftMetadataAttributes />
      <Btn class="float-right" type="primary" :loading="loading" @click="createMetadata">
        {{ $t('nft.upload.csvConfirmAttributes') }}
      </Btn>
    </n-space>
  </modal>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const loading = ref<boolean>(false);

const { vueApp } = useNuxtApp();
const $papa = vueApp.config.globalProperties.$papa;

/**
 * Attributes
 */
const modalMetadataAttributesVisible = ref<boolean>(false);
const metadataRequired = ['name', 'description', 'image'];
const metadataProperties = [
  'name',
  'description',
  'external_url',
  'image',
  'image_data',
  'attributes',
  'background_color',
  'animation_url',
  'youtube_url',
];

/**
 * Validation
 */
const isSameNumOfRows = computed<boolean>(() => {
  return (
    collectionStore.active?.maxSupply === 0 ||
    collectionStore.active?.maxSupply === collectionStore.csvData?.length
  );
});
const hasRequiredMetadata = computed<boolean>(() => {
  const csvColumns: Array<string> = collectionStore.csvColumns.map(
    (item: NTableColumn<KeyTitle>) => {
      return (item as KeyTitle).key;
    }
  );
  return metadataRequired.every(item => csvColumns.includes(item));
});
const isCsvValid = computed<boolean>(() => {
  return isSameNumOfRows.value && hasRequiredMetadata.value;
});

onMounted(() => {
  if (!!collectionStore.csvFile?.file && !collectionStore.csvData) {
    parseUploadedFile(collectionStore.csvFile.file);
  }
});

/** Upload file request - add file to list */
function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  if (file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
    console.warn(file.type);
    message.warning($i18n.t('validation.fileTypeNotCsv'));

    /** Mark file as failed */
    onError();
    return;
  }
  collectionStore.csvAttributes = [];
  collectionStore.csvFile = {
    ...file,
    percentage: 0,
    size: file.file?.size || 0,
    timestamp: Date.now(),
    onFinish,
    onError,
  };
  parseUploadedFile(collectionStore.csvFile.file);
}

/**
 * Parse CSV file and prepare data, columns and attributes
 */
function parseUploadedFile(file?: File | null) {
  if (!file) {
    return;
  }

  $papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results: CsvFileData) {
      if (results.data.length) {
        collectionStore.csvData = results.data;
        collectionStore.csvColumns = results.meta.fields.map(item => {
          return {
            title: item,
            key: item,
          };
        });
        collectionStore.csvAttributes = results.meta.fields
          .filter(item => !metadataProperties.includes(item))
          .map(item => {
            return {
              value: item,
              label: item,
              display_type: 'string',
            };
          });
      } else {
        message.warning($i18n.t('validation.fileNoData'));

        collectionStore.csvFile.onError();
        collectionStore.csvFile = {} as FileListItemType;
      }
    },
    error: function (error: string) {
      console.warn(error);

      collectionStore.csvFile.onError();
      collectionStore.csvFile = {} as FileListItemType;
    },
  });
}

function createMetadata() {
  loading.value = true;
  collectionStore.metadata = createNftData();

  loading.value = false;
  collectionStore.mintTab = NftMintTab.IMAGES;
}

/**
 * Prepare NFT data: array of JSONs with formatted properties and attributes
 */
function createNftData(): Array<Record<string, any>> {
  return collectionStore.csvData.map(item => {
    const nft: Record<string, any> = {};
    Object.entries(item).forEach(([key, value]) => {
      if (!collectionStore.csvSelectedAttributes.includes(key)) {
        nft[key] = value;
      }
    });

    const attributes: Array<Record<string, any>> = [];
    collectionStore.csvAttributes.forEach(attribute => {
      if (collectionStore.csvSelectedAttributes.includes(attribute.value)) {
        attributes.push(attribute);
      }
    });
    if (attributes.length > 0) {
      nft.attributes = attributes;
    }

    return nft;
  });
}
</script>
