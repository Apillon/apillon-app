<template v-if="items.length">
  <Btn type="primary" class="mt-2 w-full" :loading="loading" @click="downloadFiles">
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

  props.items.forEach(item => {
    downloadFile(item);
  });

  loading.value = false;
  emit('submitSuccess');
}
</script>
