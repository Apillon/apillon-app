<template>
  <div class="">
    <h2>{{ $t('nft.collection.createStep.1') }}</h2>
    <p>{{ $t('nft.metadata.startFresh') }}</p>

    <CardSelect
      icon="menu/NFTs"
      :title="$t('nft.amount.single')"
      :content="$t('nft.amount.singleContent')"
      :selected="nextStep === NftMetadataStep.SINGLE"
      @click="select(NftMetadataStep.SINGLE)"
    />

    <strong class="text-sm">OR select from import options</strong>

    <CardSelect
      v-for="option in options"
      :key="option.key"
      :icon="option.icon"
      :title="$t(`nft.amount.${option.key}`)"
      :content="$t(`nft.amount.${option.key}Content`)"
      :selected="nextStep === option.value"
      @click="select(option.value)"
    />
  </div>
</template>

<script setup lang="ts">
import { NftMetadataStep } from '~/lib/types/nft';

const emits = defineEmits(['nextStep']);
const collectionStore = useCollectionStore();
const nextStep = ref<number>();

onMounted(() => {
  collectionStore.getQuota();
});

const options = [
  { key: 'csv', icon: 'icon/table', value: NftMetadataStep.CSV },
  { key: 'endpoint', icon: 'icon/web', value: NftMetadataStep.ENDPOINT },
  { key: 'json', icon: 'icon/json', value: NftMetadataStep.JSON },
];

function select(next: number) {
  nextStep.value = next;
  emits('nextStep', next);
}
</script>
