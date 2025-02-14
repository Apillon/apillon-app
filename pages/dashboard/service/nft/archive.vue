<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderNft />
    </template>
    <slot>
      <n-space v-if="collectionStore.hasCollectionArchive" class="pb-8" :size="32" vertical>
        <ActionsNftCollection archive />
        <TableNftCollection :collections="collectionStore.archive" archive />
      </n-space>
      <Empty
        v-else
        :title="t('nft.collection.emptyArchive')"
        :info="t('nft.collection.emptyArchiveInfo')"
        icon="nft/illustration"
      >
        <Btn type="primary" :to="{ name: 'dashboard-service-nft' }">
          {{ t('dashboard.nav.nft') }}
        </Btn>
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await collectionStore.getCollectionArchive();

  /** Get Price list */
  paymentStore.getPriceList();

  pageLoading.value = false;
});
</script>
