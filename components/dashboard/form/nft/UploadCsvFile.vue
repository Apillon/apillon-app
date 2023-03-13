<template>
  <n-space class="pb-8" :size="32" vertical>
    <template v-if="collectionStore.hasCsvFile">
      <n-data-table :columns="collectionStore.csvColumns" :data="collectionStore.csvData" />
      <n-space justify="end">
        <n-upload :show-file-list="false" :custom-request="uploadFileRequest">
          <Btn type="secondary">
            {{ $t('nft.upload.differentFile') }}
          </Btn>
        </n-upload>
        <Btn
          type="primary"
          :disabled="!collectionStore.hasCsvFile"
          @click="collectionStore.mintTab = NftMintTab.IMAGES"
        >
          {{ $t('nft.upload.csvConfirm') }}
        </Btn>
      </n-space>
    </template>
    <n-upload v-else :show-file-list="false" :custom-request="uploadFileRequest">
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
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

/** Papa parser */
type CsvFileData = {
  data: Array<any>;
  errors: Array<any>;
  meta: {
    aborted: boolean;
    cursor: number;
    delimeter: string;
    fields: Array<string>;
    linebreak: string;
    truncated: boolean;
  };
};
const { vueApp } = useNuxtApp();
const $papa = vueApp.config.globalProperties.$papa;

onMounted(() => {
  if (!!collectionStore.csvFile?.file && !collectionStore.csvData) {
    parseUploadedFile(collectionStore.csvFile.file);
  }
});

/** Upload file request - add file to list */
function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  if (file.type !== 'text/csv') {
    message.warning($i18n.t('validation.fileTypeNotCsv'));
    return;
  }

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

function parseUploadedFile(file?: File | null) {
  if (!file) {
    return;
  }

  $papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results: CsvFileData) {
      if (!!results.data.length) {
        collectionStore.csvData = results.data;
        collectionStore.csvColumns = results.meta.fields.map(item => {
          return {
            title: item,
            key: item,
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
</script>
