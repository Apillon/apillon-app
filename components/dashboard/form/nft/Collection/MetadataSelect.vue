<template>
  <div class="">
    <h2>{{ t('nft.collection.createStep.1') }}</h2>
    <p>{{ t('nft.metadata.startFresh') }}</p>

    <NftCardMetadata
      :class="selectedMetadata === 'new' ? 'border-yellow' : 'border-bg-lighter'"
      @click="selectedMetadata = 'new'"
    >
    </NftCardMetadata>

    <strong>OR select from existing</strong>

    <div class="mx-auto my-6 flex flex-col gap-4 whitespace-pre-line">
      <div
        v-for="metadata in []"
        class="flex cursor-pointer gap-2 rounded-md border p-4"
        :class="selectedMetadata === metadata ? 'border-yellow' : 'border-bg-lighter'"
        @click="selectedMetadata = metadata"
      >
        <NuxtIcon name="nft/metadata" class="text-5xl" filled />
        <div class="flex items-center justify-between gap-2">
          <strong>name</strong>
          <span>55 files</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const selectedMetadata = ref<string>('');

onMounted(() => {
  collectionStore.getQuota();
});
</script>
