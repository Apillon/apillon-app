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
const simpletsStore = useSimpletsStore();

const pricing = computed<ProductPriceInterface[]>(() => {
  const prices: ProductPriceInterface[] = [];

  const priceSimplet = paymentStore.findServicePrice(PriceServiceName.SIMPLET);
  if (priceSimplet) prices.push(priceSimplet);

  return prices;
});

const data = ref<Record<string, string | boolean>[]>([
  { label: t('form.label.simplet.name'), value: simpletsStore.form.name },
  {
    label: t('form.label.simplet.description'),
    value: simpletsStore.form.description,
    show: !!simpletsStore.form.description,
  },
]);

onMounted(() => {
  paymentStore.getPriceList();

  if (simpletsStore.form.type !== SimpletType.FREE_MINT) {
    data.value.push({ label: t('form.label.smtp.host'), value: simpletsStore.form.smtp.host });
    data.value.push({ label: t('form.label.smtp.port'), value: simpletsStore.form.smtp.port });
    data.value.push({ label: t('form.label.smtp.username'), value: simpletsStore.form.smtp.username });
    data.value.push({ label: t('form.label.smtp.password'), value: simpletsStore.form.smtp.password });
    data.value.push({ label: t('form.label.smtp.sender'), value: simpletsStore.form.smtp.senderName });
    data.value.push({ label: t('form.label.smtp.email'), value: simpletsStore.form.smtp.senderEmail });
    // data.value.push({
    //   label: t('form.label.apiKey'),
    //   value: simpletsStore.form.apiKey || '',
    //   show: !!simpletsStore.form.apiKey,
    // });
  }
});
</script>
