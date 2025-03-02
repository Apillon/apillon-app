<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderNft />
    </template>
    <slot>
      <n-space v-if="collectionStore.hasCollections" class="pb-8" :size="32" vertical>
        <ActionsNftCollection />
        <TableNftCollection :collections="collectionStore.items" />
      </n-space>
      <Empty
        v-else
        :title="$t('nft.collection.empty')"
        :info="$t('nft.collection.emptyInfo')"
        icon="nft/illustration"
      >
        <Btn type="primary" @click="router.push({ name: 'dashboard-service-nft-new' })">
          {{ $t('nft.collection.createFirst') }}
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

let collectionInterval: any = null as any;

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await collectionStore.getCollections();

      /** Get Price list */
      paymentStore.getPriceList();

      setTimeout(() => {
        checkUnfinishedCollections();
      }, 3000);

      pageLoading.value = false;
    });
  }, 100);
});
onUnmounted(() => {
  clearInterval(collectionInterval);
});

/** Collection polling */
function checkUnfinishedCollections() {
  const unfinishedCollection = collectionStore.items.find(
    collection =>
      collection.collectionStatus === CollectionStatus.DEPLOY_INITIATED ||
      collection.collectionStatus === CollectionStatus.DEPLOYING
  );
  if (unfinishedCollection === undefined) {
    return;
  }

  clearInterval(collectionInterval);
  collectionInterval = setInterval(async () => {
    const collections = await collectionStore.fetchCollections(false, false);
    const collection = collections.find(
      collection => collection.collection_uuid === unfinishedCollection.collection_uuid
    );
    if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(collectionInterval);
    }
  }, 30000);
}
</script>
