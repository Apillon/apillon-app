<template>
  <Dashboard :empty="!dataStore.project.selected || !collectionStore.hasCollections" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/4-nfts.html"
        :image="NftCardsPNG"
        :name="ServiceTypeName.NFT.toLowerCase()"
        :service="ServiceTypeName.NFT"
      >
        <template #actions>
          <Btn size="large" type="primary" @click="collectionStore.modalCreateVisible = true">
            {{ $t('nft.collection.new') }}
          </Btn>
        </template>
      </ServiceEmpty>
    </template>
    <template #heading>
      <HeaderNft />
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <ActionsNft />
      <TableNftCollection :collections="collectionStore.items" :search="collectionStore.search" />
    </n-space>
  </Dashboard>

  <!-- Modal - Collection Transfer -->
  <ModalNft v-model:show="collectionStore.modalCreateVisible" />
</template>

<script lang="ts" setup>
import NftCardsPNG from '/assets/images/nft/nft-cards.png';

const { t } = useI18n();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();

const pageLoading = ref<boolean>(true);

let collectionInterval: any = null as any;

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await collectionStore.getCollections();

  storageStore.getStorageInfo();
  paymentStore.getPriceList();

  setTimeout(() => {
    checkUnfinishedCollections();
  }, 3000);

  pageLoading.value = false;
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
