<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplets />
    </template>
    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsSimplets />
        <TableSimplets :search="simpletsStore.search" />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const simpletsStore = useSimpletsStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await simpletsStore.getSimplets();
  paymentStore.getPriceList();

  pageLoading.value = false;
});
</script>
