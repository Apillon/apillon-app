<template>
  <n-upload :show-file-list="false" :custom-request="uploadFileRequest">
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
  <n-data-table v-if="collectionStore.csvFile" :columns="columns" :data="data" />
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const message = useMessage();
const collectionStore = useCollectionStore();

const columns = ref<Array<any>>([]);
const data = ref<Array<any>>([]);

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
  if (collectionStore.csvFile?.file) {
    parseUploadedFile(collectionStore.csvFile.file);
  }
});

/** Upload file request - add file to list */
function uploadFileRequest({ file, onError, onFinish }: NUploadCustomRequestOptions) {
  if (file.type !== 'text/csv') {
    message.warning('text/csv');
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

  parseUploadedFile(file.file);
}

function parseUploadedFile(file) {
  $papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results: CsvFileData) {
      data.value = results.data;
      columns.value = results.meta.fields.map(item => {
        return {
          title: item,
          key: item,
        };
      });
    },
  });
}
</script>
