<template>
  <div class="">
    <h2>{{ t('nft.collection.createStep.1') }}</h2>
    <p>{{ t('nft.metadata.startFresh') }}</p>

    <NftCardSelect
      icon="nft/metadata"
      title="I want a fresh start"
      content="Start by adding new NFTs"
      :selected="selectedMetadata === NftMetadataStep.NEW"
      @click="createNew()"
    />

    <strong>OR select from existing</strong>

    <div class="mx-auto my-6 flex flex-col gap-4 whitespace-pre-line">
      <NftCardSelect
        v-for="metadata in []"
        icon="nft/metadata"
        :title="metadata.name"
        :content="metadata.length"
        :selected="selectedMetadata === metadata"
        @click="select(metadata)"
      >
      </NftCardSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NftMetadataStep } from '~/lib/types/nft';

const emits = defineEmits(['nextStep', 'select']);
const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const selectedMetadata = ref();

onMounted(() => {
  collectionStore.getQuota();
});

function createNew() {
  selectedMetadata.value = NftMetadataStep.NEW;
  emits('nextStep', NftMetadataStep.NEW);
}
function select(next: number) {
  selectedMetadata.value = next;
  emits('select', selectedMetadata.value);
}
</script>
