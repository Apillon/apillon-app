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
        :pricing="paymentStore.filterServicePrice([PriceServiceName.SIMPLET_NFT_STUDIO_DEPLOY])"
        :deploy-text="$t('simplet.wizard.create')"
        @deploy="$emit('deploy')"
      />
    </template>
  </ReviewLayout>
</template>

<script setup lang="ts">
defineEmits(['back', 'deploy']);

const { t } = useI18n();
const paymentStore = usePaymentStore();
const simpletStore = useSimpletStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const data = ref<Record<string, string | boolean>[]>([
  { label: t('form.label.simplet.name'), value: simpletStore.form.name },
  { label: t('form.label.description'), value: simpletStore.form.description },
  { label: t('nft.collection.preview'), value: simpletStore.form.collection?.name || '' },
  { label: t('form.label.simplet.walletAddress'), value: simpletStore.form.walletAddress || '' },
  {
    label: t('form.label.embeddedWallet.integration'),
    value: embeddedWalletStore.items.find(c => c.integration_uuid === simpletStore.form.embeddedWallet)?.title || '',
    show: !!simpletStore.form.embeddedWallet,
  },
  {
    label: t('form.label.simplet.startTime'),
    value: timestampToDateAndTime((simpletStore.form.startTime || 0) / 1000),
    show: !!simpletStore.form.startTime,
  },
  {
    label: t('form.label.simplet.endTime'),
    value: timestampToDateAndTime((simpletStore.form.endTime || 0) / 1000),
    show: !!simpletStore.form.startTime,
  },
]);

onMounted(() => {
  paymentStore.getPriceList();

  if (
    simpletStore.form.type?.name !== SimpletName.FREE_MINT &&
    simpletStore.form.smtp.host &&
    simpletStore.form.smtp.host !== 'nft_studio_mail'
  ) {
    data.value.push({ label: t('form.label.smtp.host'), value: simpletStore.form.smtp.host });
    data.value.push({ label: t('form.label.smtp.port'), value: `${simpletStore.form.smtp.port}` });
    data.value.push({ label: t('form.label.smtp.username'), value: simpletStore.form.smtp.username });
    data.value.push({ key: 'password', label: t('form.label.smtp.password'), value: simpletStore.form.smtp.password });
    data.value.push({ label: t('form.label.smtp.sender'), value: simpletStore.form.smtp.senderName });
    data.value.push({ label: t('form.label.smtp.email'), value: simpletStore.form.smtp.senderEmail });
  }
  if (simpletStore.form.mysql.host && simpletStore.form.mysql.host !== 'nft_studio_db') {
    data.value.push({ label: t('form.label.mysql.host'), value: simpletStore.form.mysql.host });
    data.value.push({ label: t('form.label.mysql.port'), value: `${simpletStore.form.mysql.port}` });
    data.value.push({ label: t('form.label.mysql.database'), value: simpletStore.form.mysql.database });
    data.value.push({ label: t('form.label.mysql.user'), value: simpletStore.form.mysql.user });
    data.value.push({
      key: 'password',
      label: t('form.label.mysql.password'),
      value: simpletStore.form.mysql.password,
    });
  }
});
</script>
