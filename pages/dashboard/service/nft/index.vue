<template>
  <Dashboard :empty="!dataStore.project.selected || !collectionStore.hasCollections" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/4-nfts.html"
        :image="NftCardsPNG"
        :name="ServiceTypeName.NFT.toLowerCase()"
        :service="ServiceTypeName.NFT"
        :guides="serviceGuides"
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
  <NftModal v-model:show="collectionStore.modalCreateVisible" />
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

const serviceGuides = [
  {
    title: 'Guide: NFT Service prerequisites - Generate NFT art (with AI) and get files ready',
    content:
      'In this preliminary guide on the Apillon NFT Service, you will learn how to prepare files and metadata for a smooth deployment of your…',
    link: 'https://blog.apillon.io/guide-nft-service-pt-1-generate-nft-art-with-ai-and-get-files-ready-200168b6b303/',
  },
  {
    title: 'Guide: NFT Service — Create and deploy NFT collection on Moonbeam',
    content:
      'In this guide, you will learn step-by-step how to go from raw data and files to a permanently deployed NFT collection on Moonbeam Network.',
    link: 'https://blog.apillon.io/guide-nft-service-pt-2-create-and-deploy-nft-collection-on-moonbeam-2d7eedf79756/',
  },
  {
    title: 'Guide: NFT Service — Create and deploy NFT collection on Astar',
    content:
      'With the latest addition to the Apillon NFT Service, you can now deploy NFTs to the Astar Network in a few-click manner.',
    link: 'https://blog.apillon.io/guide-nft-service-create-and-deploy-nft-collection-on-astar-3d6674994b0f/',
  },
];

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
