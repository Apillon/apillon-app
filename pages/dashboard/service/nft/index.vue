<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderNft />
    </template>
    <slot>
      <n-space v-if="collectionStore.hasCollections" class="pb-8" :size="32" vertical>
        <ActionsNft />
        <TableNftCollection :collections="collectionStore.items" />
      </n-space>
      <Empty v-else :title="t('nft.collection.empty')" :info="t('nft.collection.emptyInfo')" icon="nft/illustration">
        <Btn type="primary" @click="modalCreateCollectionVisible = true">
          {{ t('nft.collection.createFirst') }}
        </Btn>
      </Empty>

      <!-- Modal - Collection Transfer -->
      <modal
        v-model:show="modalCreateCollectionVisible"
        class="max-w-4xl text-center"
        :class="{
          'xl:max-w-5xl xxl:max-w-7xl':
            collectionStore.metadataStored !== undefined && collectionStore.form.behavior.chain === undefined,
        }"
      >
        <FormNftCollectionMetadataType v-if="collectionStore.metadataStored === undefined" />
        <FormNftCollectionNetworkSelect
          v-else-if="collectionStore.form.behavior.chain === undefined"
          @submit="onNetworkSelected"
        />
        <FormNftCollectionIpnsType v-else @submit="router.push({ name: 'dashboard-service-nft-new' })" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();
const { onNetworkSelected, resetAll } = useCollection();

const pageLoading = ref<boolean>(true);
const modalCreateCollectionVisible = ref<boolean>(false);

let collectionInterval: any = null as any;

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  resetAll();
  await sleep(100);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await collectionStore.getCollections();

    storageStore.getStorageInfo();
    paymentStore.getPriceList();

    setTimeout(() => {
      checkUnfinishedCollections();
    }, 3000);

    pageLoading.value = false;
  });
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
