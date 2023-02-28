<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCollection />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
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
          :title="$t('nft.collectionsEmpty')"
          :info="$t('nft.collectionsCreate')"
          icon="nft/illustration"
        >
          <Btn type="primary" @click="modalMintCollectionVisible = true">
            {{ $t('nft.collection.mint') }}
          </Btn>
        </Empty>

        <!-- <NftMintTabs /> -->
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

/** Pooling */
let collectionInterval: any = null as any;
let transactionInterval: any = null as any;

/** Website ID from route */
const collectionId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(async () => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const collections = await collectionStore.getCollections();
    const currentCollection = collections.find(item => item.id === collectionId.value);

    if (!currentCollection) {
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

/** Collection pooling */
function checkIfCollectionUnfinished() {
  if (collectionStore.active.collectionStatus >= CollectionStatus.DEPLOYED) {
    return;
  }

  collectionInterval = setInterval(async () => {
    const collections = await collectionStore.fetchCollections(false);
    const collection = collections.find(collection => collection.id === collectionStore.active.id);
    if (!collection) {
      clearInterval(collectionInterval);
      return;
    } else if (collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      collectionStore.active = collection;
      clearInterval(collectionInterval);
    }
  }, 30000);
}

/** Transactions pooling */
function checkUnfinishedTransactions() {
  const unfinishedTransaction = collectionStore.transaction.find(
    transaction => transaction.transactionStatus < TransactionStatus.FINISHED
  );
  if (unfinishedTransaction === undefined) {
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
    if (!transaction) {
      clearInterval(transactionInterval);
      return;
    } else if (transaction.transactionStatus >= TransactionStatus.FINISHED) {
      clearInterval(transactionInterval);
    }
  }, 30000);
}
</script>
