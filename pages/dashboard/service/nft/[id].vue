<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCollection />
    </template>

    <slot>
      <NftMintTabs v-if="collectionStore.active?.collectionStatus === CollectionStatus.CREATED" />
      <n-space v-else class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsNftTransaction
          @mint="modalMintCollectionVisible = true"
          @transfer="modalTransferOwnershipVisible = true"
        />

        <!-- Table -->
        <TableNftTransaction
          v-if="collectionStore.hasCollectionTransactions"
          :transactions="collectionStore.transaction"
        />
        <Empty
          v-else
          :title="$t('nft.transaction.empty')"
          :info="$t('nft.transaction.emptyInfo')"
          icon="nft/illustration"
        />
      </n-space>

      <!-- Modal - Collection Mint -->
      <modal v-model:show="modalMintCollectionVisible" :title="$t('nft.collection.mint')">
        <FormNftMint
          :collection-uuid="collectionStore.active.collection_uuid"
          @submit-success="onNftMinted"
        />
      </modal>

      <!-- Modal - Collection Transfer -->
      <modal v-model:show="modalTransferOwnershipVisible" :title="$t('nft.collection.transfer')">
        <FormNftTransfer
          :collection-uuid="collectionStore.active.collection_uuid"
          @submit-success="onNftTrasnfered"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const $i18n = useI18n();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();

const pageLoading = ref<boolean>(true);
const modalMintCollectionVisible = ref<boolean | null>(false);
const modalTransferOwnershipVisible = ref<boolean | null>(false);

/** Polling */
let collectionInterval: any = null as any;
let transactionInterval: any = null as any;

/** Website ID from route */
const collectionId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const currentCollection = await collectionStore.getCollection(collectionId.value);

    /** Reset state if user opens different collection */
    if (collectionId.value !== collectionStore.active?.id) {
      collectionStore.resetMetadata();
    }

    if (!currentCollection?.collection_uuid) {
      router.push({ name: 'dashboard-service-nft' });
    } else {
      await collectionStore.getCollectionTransactions(currentCollection.collection_uuid);
      collectionStore.active = currentCollection;

      checkIfCollectionUnfinished();
      checkUnfinishedTransactions();
      pageLoading.value = false;
    }
  });
});
onUnmounted(() => {
  clearInterval(transactionInterval);
  clearInterval(collectionInterval);
});

/** Watch collectionStatus, if status changed from Created to Initiated, start polling */
watch(
  () => collectionStore.active?.collectionStatus,
  (status, oldStatus) => {
    if (status === CollectionStatus.DEPLOY_INITIATED && oldStatus === CollectionStatus.CREATED) {
      checkIfCollectionUnfinished();
    }
  }
);

function onNftMinted() {
  modalMintCollectionVisible.value = false;
  setTimeout(() => {
    collectionStore.fetchCollectionTransactions(collectionStore.active.collection_uuid, false);

    setTimeout(() => {
      checkUnfinishedTransactions();
    }, 3000);
  }, 3000);
}

function onNftTrasnfered() {
  modalTransferOwnershipVisible.value = false;
  setTimeout(() => {
    collectionStore.fetchCollections();

    setTimeout(() => {
      checkUnfinishedTransactions();
    }, 10000);
  }, 3000);
}

/** Collection polling */
function checkIfCollectionUnfinished() {
  if (collectionStore.active.collectionStatus >= CollectionStatus.DEPLOYED) {
    clearInterval(collectionInterval);
    return;
  }

  collectionInterval = setInterval(async () => {
    const collection = await collectionStore.fetchCollection(collectionId.value);
    await collectionStore.fetchCollectionTransactions(
      collectionStore.active.collection_uuid,
      false
    );
    if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(collectionInterval);

      /** On collection deploy, start transaction polling */
      checkUnfinishedTransactions();
    }
  }, 30000);
}

/** Transactions polling */
function checkUnfinishedTransactions() {
  const unfinishedTransaction = collectionStore.transaction.find(
    transaction => transaction.transactionStatus < TransactionStatus.FINISHED
  );
  if (unfinishedTransaction === undefined) {
    clearInterval(transactionInterval);
    return;
  }

  transactionInterval = setInterval(async () => {
    const transactions = await collectionStore.fetchCollectionTransactions(
      collectionStore.active.collection_uuid,
      false
    );
    const transaction = transactions.find(
      transaction => transaction.id === unfinishedTransaction.id
    );
    if (!transaction || transaction.transactionStatus >= TransactionStatus.FINISHED) {
      clearInterval(transactionInterval);
      await collectionStore.fetchCollection(collectionId.value);
    }
  }, 30000);
}
</script>
