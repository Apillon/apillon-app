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

const { downloadFile } = useFile();
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
</script>
