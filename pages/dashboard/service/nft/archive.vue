<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderNft />
    </template>
    <slot>
      <TableNftCollection
        v-if="collectionStore.hasCollectionArchive"
        :collections="collectionStore.archive"
        archive
      />
      <Empty
        v-else
        :title="$t('nft.collection.emptyArchive')"
        :info="$t('nft.collection.emptyArchiveInfo')"
        icon="nft/illustration"
      >
        <Btn type="primary" @click="router.push({ name: 'dashboard-service-nft-new' })">
          {{ $t('nft.collection.create') }}
        </Btn>
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const collectionStore = useCollectionStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await collectionStore.getCollectionArchive();

      /** Get Price list */
      paymentStore.getPriceList();

      pageLoading.value = false;
    });
  }, 100);
});
</script>
