<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplets />
    </template>
    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsSimplets />
        <TableSimplets :search="simpletStore.search" />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const simpletStore = useSimpletStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await simpletStore.getSimplets();
  paymentStore.getPriceList();

  pageLoading.value = false;
});
</script>
