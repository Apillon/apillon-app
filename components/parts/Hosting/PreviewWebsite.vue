<template>
  <ReviewLayout>
    <template #left>
      <ReviewTable class="md:w-1/2" :data="data" :info="$t('hosting.website.review.info')" @back="$emit('back')" />
    </template>

    <template #right>
      <ReviewPricing class="mt-8 md:!w-1/2" :pricing="pricing" @deploy="$emit('deploy')" />
    </template>
  </ReviewLayout>
</template>

<script setup lang="ts">
defineEmits(['back', 'deploy']);

const { t } = useI18n();
const paymentStore = usePaymentStore();
const websiteStore = useWebsiteStore();

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

onMounted(() => {
  paymentStore.getPriceList();

  if (websiteStore.form.type === WebsiteType.GITHUB) {
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
