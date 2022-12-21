<template v-if="items.length">
  <Btn type="primary" class="w-full mt-2" :loading="loading" @click="downloadFiles">
    <template v-if="items.length === 1">
      {{ $t(`storage.download.item`) }}
    </template>
    <template v-else-if="items.length > 1">
      {{ $t(`storage.download.items`) }}
    </template>
  </Btn>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  items: { type: Array<FolderInterface>, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const emit = defineEmits(['submitSuccess']);

const loading = ref(false);

async function downloadFiles() {
  loading.value = true;
  const promises: Array<Promise<any>> = [];

  props.items.map(async item => {
    const req = downloadFile(item.CID);
    promises.push(req);
    const res = await req;
    console.log(req);
    console.log(res);
  });
  console.log(promises);

  Promise.all(promises).then(_ => {
    loading.value = false;
    emit('submitSuccess');
  });
}

/** Download file - get file details and download content from downloadLink */
async function downloadFile(CID?: string | null) {
  if (!CID) {
    console.warn('MISSING File CID!');
    return;
  }
  if (!(CID in dataStore.file.items)) {
    dataStore.file.items[CID] = await dataStore.fetchFileDetails(CID, $i18n);
  }
  const fileDetails: FileDetails = dataStore.file.items[CID].file;
  return download(fileDetails.downloadLink, fileDetails.name);
}
</script>
