<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplets />
    </template>
    <slot>
      <n-space v-if="simpletStore.hasSimpletsArchive" class="pb-8" :size="32" vertical>
        <ActionsSimplets archive />
        <TableSimplets :search="simpletStore.archive.search" archive />
      </n-space>
      <Empty v-else :title="t('simplet.emptyArchive')" :info="t('simplet.emptyArchiveInfo')" icon="nft/illustration">
        <Btn type="primary" :to="{ name: 'dashboard-simplet-list' }">
          {{ $t('simplet.menu.list') }}
        </Btn>
      </Empty>
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
  await simpletStore.getSimpletsArchive();
  paymentStore.getPriceList();

  pageLoading.value = false;
});
</script>
