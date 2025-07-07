<template>
  <ReviewLayout>
    <template #left>
      <ReviewTable
        class="w-full md:w-1/2"
        :data="data"
        :info="$t('hosting.website.review.info')"
        @back="$emit('back')"
      />
    </template>

    <template #right>
      <ReviewPricing
        class="mt-8 w-full md:!w-1/2"
        :pricing="pricing"
        :deploy-text="$t('hosting.website.create')"
        @deploy="$emit('deploy')"
      />
    </template>
  </ReviewLayout>
</template>

<script setup lang="ts">
defineEmits(['back', 'deploy']);

const { t } = useI18n();
const paymentStore = usePaymentStore();
const websiteStore = useWebsiteStore();
const collectionStore = useCollectionStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pricing = computed<ProductPriceInterface[]>(() => {
  const prices: ProductPriceInterface[] = [];

  const priceCollection = paymentStore.findServicePrice(PriceServiceName.HOSTING_WEBSITE);
  if (priceCollection) prices.push(priceCollection);

  return prices;
});

const data = ref<Record<string, string | boolean>[]>([
  { label: t('form.label.website.name'), value: websiteStore.form.name },
  {
    label: t('form.label.website.description'),
    value: websiteStore.form.description,
    show: !!websiteStore.form.description,
  },
]);

const templateTypeName = (type: number) =>
  type === NftWebsiteType.VUE
    ? t('nft.collection.websiteDeploy.vue')
    : type === NftWebsiteType.REACT
      ? t('nft.collection.websiteDeploy.react')
      : t('nft.collection.websiteDeploy.plain_js');

onMounted(() => {
  const isApillonNftRepo = apillonRepos.some(r => r.id === websiteStore.form.repoId);
  paymentStore.getPriceList();

  if (isApillonNftRepo) {
    data.value.push({ label: 'Template type', value: templateTypeName(websiteStore.form.templateType) });
    data.value.push({
      label: t('nft.collection.preview'),
      value: collectionStore.items.find(c => c.collection_uuid === websiteStore.form.nftCollection)?.name || '',
      show: !!websiteStore.form.nftCollection,
    });
    data.value.push({
      label: t('form.label.embeddedWallet.integration'),
      value: embeddedWalletStore.items.find(c => c.integration_uuid === websiteStore.form.embeddedWallet)?.title || '',
      show: !!websiteStore.form.embeddedWallet,
    });
    data.value.push({
      label: t('form.label.apiKey'),
      value: websiteStore.form.apiKey || '',
      show: !!websiteStore.form.apiKey,
    });
  } else if (websiteStore.form.type === WebsiteType.GITHUB) {
    data.value.push({ label: t('form.label.website.repository'), value: websiteStore.form.repoName });
    data.value.push({ label: t('form.label.website.repoUrl'), value: websiteStore.form.repoUrl });
    data.value.push({ label: t('form.label.website.branchName'), value: websiteStore.form.branchName });
    data.value.push({ label: t('form.label.website.installCommand'), value: websiteStore.form.installCommand });
    data.value.push({ label: t('form.label.website.buildCommand'), value: websiteStore.form.buildCommand });
    data.value.push({ label: t('form.label.website.buildDirectory'), value: websiteStore.form.buildDirectory });
    data.value.push({
      label: t('form.label.apiKey'),
      value: websiteStore.form.apiKey || '',
      show: !!websiteStore.form.apiKey,
    });
  }
});
</script>
