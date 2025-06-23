<template>
  <ReviewLayout>
    <template #left>
      <ReviewTable :data="data" :info="$t('nft.collection.review.info')" class="md:w-1/2" @back="$emit('back')">
        <div class="relative mb-20 mt-6 min-h-36 w-full flex-auto rounded-lg bg-bg-lighter">
          <Image
            v-if="metadataStore.form.visual.coverImage"
            :src="createThumbnailUrl(metadataStore.form.visual.coverImage)"
            class="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-lg object-cover object-center"
          />
          <Image
            v-if="metadataStore.form.visual.logo"
            :src="createThumbnailUrl(metadataStore.form.visual.logo)"
            class="absolute left-6 top-20 mt-2 h-28 w-28 rounded-full object-cover object-center"
          />
          <div v-else class="absolute left-6 top-20 h-28 w-28 rounded-full bg-bg-dark" />
        </div>
      </ReviewTable>
    </template>

    <template #right>
      <ReviewPricing
        class="mt-8 md:!w-1/2"
        :pricing="pricing"
        :deploy-text="$t('nft.collection.review.createCollection')"
        @deploy="$emit('deploy')"
      />
    </template>
  </ReviewLayout>
</template>

<script setup lang="ts">
defineEmits(['back', 'deploy']);
const { t } = useI18n();
const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();

const { pricing, createThumbnailUrl } = useMetadata();

const data = ref<Record<string, string | number | boolean | null>[]>([
  {
    label: t('form.label.collection.chain'),
    value: metadataStore.form.smartContract.chain || EvmChainTestnet.MOONBASE,
    key: 'chain',
  },
  { label: t('nft.collection.name'), value: metadataStore.form.smartContract.name },
  { label: t('form.label.collection.symbol'), value: metadataStore.form.smartContract.symbol },
  { label: t('form.label.collection.useGateway'), value: metadataStore.form.smartContract.useApillonIpfsGateway },
  { label: t('form.label.collection.useIpns'), value: !!metadataStore.form.smartContract.useIpns },
  {
    label: t('form.label.collection.supplyLimited'),
    value: metadataStore.form.smartContract.supplyLimited
      ? metadataStore.form.smartContract.maxSupply
      : t('form.supplyTypes.unlimited'),
  },
  { label: t('form.label.collection.revocable'), value: metadataStore.form.smartContract.revocable },
  { label: t('form.label.collection.soulbound'), value: metadataStore.form.smartContract.soulbound },
  { label: t('form.label.collection.autoIncrement'), value: metadataStore.form.smartContract.isAutoIncrement },
  {
    label: t('form.label.collection.royaltiesAddress'),
    value: metadataStore.form.smartContract.royaltiesAddress,
    show: !!metadataStore.form.smartContract.royaltiesAddress,
  },
  {
    label: t('form.label.collection.royaltiesFees'),
    value: (metadataStore.form.smartContract.royaltiesFees || '0') + '%',
    show: !!metadataStore.form.smartContract.royaltiesAddress,
  },
  {
    label: t('form.label.collection.dropReserve'),
    value: metadataStore.form.smartContract.dropReserve,
    show: metadataStore.form.smartContract.dropPrice > 0,
  },
  {
    label: t('form.label.collection.dropPrice', {
      currency: chainCurrency(metadataStore.form.smartContract.chain),
    }),
    value: metadataStore.form.smartContract.dropPrice,
    show: metadataStore.form.smartContract.dropPrice > 0,
  },
  {
    label: t('form.label.collection.dropStart'),
    value: timestampToDateAndTime(metadataStore.form.smartContract.dropStart / 1000),
    show: metadataStore.form.smartContract.dropPrice > 0,
  },
  {
    label: t('form.label.collection.dropReserve'),
    value: metadataStore.form.smartContract.dropReserve,
    show: metadataStore.form.smartContract.drop,
  },
  {
    label: t('nft.collection.review.nftFiles'),
    value: `${metadataStore.metadata.length} ${t('storage.files')}`,
  },
]);

onMounted(() => {
  paymentStore.getPriceList();
});
</script>
