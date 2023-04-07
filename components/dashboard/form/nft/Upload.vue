<template>
  <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
    <div class="w-full max-w-lg text-center">
      <!-- Upload/Confirm CSV -->
      <template v-if="!collectionStore.hasCsvFile || !collectionStore.hasMetadata">
        <h2>{{ $t('nft.upload.csvFile') }}</h2>
        <p class="text-body whitespace-pre-line">
          {{ $t('nft.upload.infoFile') }}
        </p>
        <p class="mb-6 text-body whitespace-pre-line">
          <NuxtLink href="" target="_blank">
            <Btn type="builders" size="tiny">
              <span class="inline-block leading-6 text-primary hover:text-bg-dark">
                {{ $t('general.learnMore') }}
              </span>
            </Btn>
          </NuxtLink>
          <span class="inline-block mx-1">{{ $t('general.or') }}</span>
          <NuxtLink href="/files/example.csv" target="_blank">
            <Btn type="builders" size="tiny">
              <span class="inline-block leading-6 text-primary hover:text-bg-dark">
                {{ $t('nft.upload.downloadCsv') }}
              </span>
            </Btn>
          </NuxtLink>
        </p>
        <n-upload
          v-if="!collectionStore.hasCsvFile"
          :show-file-list="false"
          accept=".csv, application/vnd.ms-excel"
          :custom-request="uploadFileRequest"
        >
          <n-upload-dragger class="h-40">
            <div class="py-2 text-center">
              <div class="inline-block w-10 h-10 bg-bg-lighter rounded-full p-2 mb-2">
                <span class="icon-upload text-violet text-2xl"></span>
              </div>

              <h4 class="mb-1">{{ $t('nft.upload.csvFile') }}</h4>
              <span class="text-body">{{ $t('nft.upload.dragAndDrop') }}</span>
            </div>
          </n-upload-dragger>
        </n-upload>
        <div v-else class="flex text-left">
          <div class="flex-1 px-4 py-2 border-1 border-bg-lighter">
            <span class="icon-file text-xl align-sub mr-3"></span>
            <span>{{ collectionStore.csvFile.name }}</span>
          </div>
          <div class="">
            <button class="flex justify-center items-center h-12 w-12 ml-4 p-3">
              <span class="icon-delete text-xl"></span>
            </button>
          </div>
        </div>

        <Btn
          class="mt-10"
          size="large"
          type="secondary"
          :disabled="!collectionStore.hasCsvFile || !isCsvValid"
          @click="modalMetadataAttributesVisible = true"
        >
          {{ $t('form.proceed') }}
        </Btn>
      </template>

      <!-- Upload Img -->
      <template v-else>
        Else
        <FormNftUploadImages />
      </template>
    </div>

    <modal v-model:show="modalMetadataAttributesVisible" :title="$t('nft.upload.attributes')">
      <n-space class="pb-8" :size="32" vertical>
        <NftMetadataAttributes />
        <Btn class="float-right" type="primary" :loading="loading" @click="createMetadata">
          {{ $t('nft.upload.csvConfirmAttributes') }}
        </Btn>
      </n-space>
    </modal>
  </div>
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
const isCsvValid = computed<boolean>(() => {
  const csvColumns: Array<string> = collectionStore.csvColumns.map(
    (item: NTableColumn<KeyTitle>) => {
      return (item as KeyTitle).key;
    }
  );
  return metadataRequired.every(item => csvColumns.includes(item));
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
