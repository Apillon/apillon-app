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
const props = defineProps({
  items: { type: Array<BucketItemInterface>, required: true },
});

const dataStore = useDataStore();
const emit = defineEmits(['submitSuccess']);

const loading = ref(false);

function downloadFiles() {
  loading.value = true;
  const promises: Array<Promise<any>> = [];

  props.items.map(async item => {
    const req = downloadFile(item.CID);
    promises.push(req);
    await req;
  });

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
  if (!(CID in fileStore.items)) {
    fileStore.items[CID] = await dataStore.fetchFileDetails(CID);
  }
  const fileDetails: FileDetails = fileStore.items[CID].file;
  return download(fileDetails.link, fileDetails.name);
}
</script>
