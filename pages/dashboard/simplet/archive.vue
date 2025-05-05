<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplets />
    </template>
    <slot>
      <n-space v-if="simpletsStore.hasSimpletsArchive" class="pb-8" :size="32" vertical>
        <ActionsSimplets archive />
        <TableSimplets :search="simpletsStore.archive.search" archive />
      </n-space>
      <Empty
        v-else
        :title="t('nft.collection.emptyArchive')"
        :info="t('nft.collection.emptyArchiveInfo')"
        icon="nft/illustration"
      >
        <Btn type="primary" :to="{ name: 'dashboard-simplet-list' }">
          {{ $t('dashboard.simplet.menu.list') }}
        </Btn>
      </Empty>
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
  await simpletsStore.getSimpletsArchive();
  paymentStore.getPriceList();

  pageLoading.value = false;
});
</script>
