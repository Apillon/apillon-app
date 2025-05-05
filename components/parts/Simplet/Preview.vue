<template>
  <ReviewLayout>
    <template #left>
      <ReviewTable class="md:w-1/2" :data="data" :info="$t('hosting.website.review.info')" @back="$emit('back')" />
    </template>

    <template #right>
      <ReviewPricing
        class="mt-8 md:!w-1/2"
        :pricing="pricing"
        :deploy-text="$t('dashboard.simplet.wizard.create')"
        @deploy="$emit('deploy')"
      />
    </template>
  </ReviewLayout>
</template>

<script setup lang="ts">
defineEmits(['back', 'deploy']);

const { t } = useI18n();
const paymentStore = usePaymentStore();
const simpletsStore = useSimpletsStore();
const collectionStore = useCollectionStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pricing = computed<ProductPriceInterface[]>(() => {
  const prices: ProductPriceInterface[] = [];

  const priceSimplet = paymentStore.findServicePrice(PriceServiceName.SIMPLET);
  if (priceSimplet) prices.push(priceSimplet);

  return prices;
});

const collectionName = (uuid: string) => collectionStore.items.find(c => c.collection_uuid === uuid)?.name || '';
const ewIntergationName = (uuid?: string | null) =>
  embeddedWalletStore.items.find(c => c.integration_uuid === uuid)?.title || '';

const data = ref<Record<string, string | boolean>[]>([
  { label: t('form.label.simplet.name'), value: simpletsStore.form.name },
  { label: t('form.label.description'), value: simpletsStore.form.description },
  { label: t('nft.collection.name'), value: collectionName(simpletsStore.form.collection) },
  { label: t('form.label.simplet.walletAddress'), value: simpletsStore.form.walletAddress },
  {
    label: t('form.label.embeddedWallet.integration'),
    value: ewIntergationName(simpletsStore.form.embeddedWallet),
    show: !!simpletsStore.form.embeddedWallet,
  },
  {
    label: t('form.label.simplet.startTime'),
    value: timestampToDateAndTime((simpletsStore.form.startTime || 0) / 1000),
    show: !!simpletsStore.form.startTime,
  },
  {
    label: t('form.label.simplet.endTime'),
    value: timestampToDateAndTime((simpletsStore.form.endTime || 0) / 1000),
    show: !!simpletsStore.form.startTime,
  },
]);

onMounted(() => {
  paymentStore.getPriceList();

  if (simpletsStore.form.type !== SimpletType.FREE_MINT && simpletsStore.form.smtp.host) {
    data.value.push({ label: t('form.label.smtp.host'), value: simpletsStore.form.smtp.host });
    data.value.push({ label: t('form.label.smtp.port'), value: `${simpletsStore.form.smtp.port}` });
    data.value.push({ label: t('form.label.smtp.username'), value: simpletsStore.form.smtp.username });
    data.value.push({ label: t('form.label.smtp.password'), value: simpletsStore.form.smtp.password });
    data.value.push({ label: t('form.label.smtp.sender'), value: simpletsStore.form.smtp.senderName });
    data.value.push({ label: t('form.label.smtp.email'), value: simpletsStore.form.smtp.senderEmail });
  }
});
</script>
