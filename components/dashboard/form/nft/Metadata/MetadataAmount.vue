<template>
  <div class="">
    <h2>{{ t('nft.collection.createStep.1') }}</h2>
    <p>{{ t('nft.metadata.startFresh') }}</p>

    <NftCardSelect
      icon="menu/NFTs"
      :title="$t('nft.amount.single')"
      :content="$t('nft.amount.singleContent')"
      :selected="collectionStore.amount === NftAmount.SINGLE"
      @click="collectionStore.amount = NftAmount.SINGLE"
    />

    <strong class="text-sm">OR select from import options</strong>

    <NftCardSelect
      v-for="option in options"
      :key="option.key"
      :icon="option.icon"
      :title="$t(`nft.amount.${option.key}`)"
      :content="$t(`nft.amount.${option.key}Content`)"
      :selected="collectionStore.amount === option.value"
      @click="collectionStore.amount = option.value"
    />
  </div>
</template>

<script setup lang="ts">
import { NftAmount } from '~/lib/types/nft';

const { t } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

onMounted(() => {
  collectionStore.getQuota();
});

const options = [
  { key: 'csv', icon: 'icon/table', value: NftAmount.MULTIPLE },
  { key: 'endpoint', icon: 'icon/web', value: NftAmount.ENDPOINT },
  { key: 'json', icon: 'icon/json', value: NftAmount.JSON },
];
</script>
