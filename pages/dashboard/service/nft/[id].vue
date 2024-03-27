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
          @nest-mint="modalNestMintCollectionVisible = true"
          @revoke="modalBurnTokensVisible = true"
          @transfer="modalTransferOwnershipVisible = true"
        />

        <!-- Table -->
        <template v-if="collectionStore.hasCollectionTransactions">
          <TableNftTransaction :transactions="collectionStore.transaction" />

          <div class="w-full max-w-lg text-center mx-auto">
            <NuxtIcon name="nft/collection" class="flex justify-center icon-auto mb-4" filled />
            <h2>{{ $t('nft.collection.created.title') }}</h2>
            <p class="mb-2 text-body whitespace-pre-line">
              {{ $t('nft.collection.created.info') }}
            </p>

            <div class="mb-2 flex items-center justify-center text-body">
              <p>{{ $t('nft.collection.createToDisplay') }}&nbsp;</p>
              <a href="https://github.com/Apillon/nft-template-vue/fork" target="_blank">
                <Btn type="builders" size="tiny"> Vue </Btn>
              </a>
              <p>,&nbsp;</p>
              <a href="https://github.com/Apillon/nft-template-react/fork" target="_blank">
                <Btn type="builders" size="tiny"> React </Btn>
              </a>
              <p>&nbsp;{{ $t('general.or') }}&nbsp;</p>
              <a href="https://github.com/Apillon/nft-template/fork" target="_blank">
                <Btn type="builders" size="tiny"> javascript template </Btn>
              </a>
              <p>.</p>
            </div>
          </div>
        </template>
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
          :chain-id="collectionStore.active.chain"
          @submit-success="onNftMinted"
        />
      </modal>

      <!-- Modal - Collection Nest Mint -->
      <modal v-model:show="modalNestMintCollectionVisible" :title="$t('nft.collection.nestMint')">
        <FormNftNestMint
          :collection-uuid="collectionStore.active.collection_uuid"
          :chain-id="collectionStore.active.chain"
          @submit-success="onNftNestMinted"
        />
      </modal>

      <!-- Modal - Burn Tokens -->
      <modal v-model:show="modalBurnTokensVisible" :title="$t('nft.collection.burn.title')">
        <FormNftBurn
          :collection-uuid="collectionStore.active.collection_uuid"
          :chain-id="collectionStore.active.chain"
          @submit-success="onNftBurned"
        />
      </modal>

      <!-- Modal - Collection Transfer -->
      <modal v-model:show="modalTransferOwnershipVisible" :title="$t('nft.collection.transfer')">
        <FormNftTransfer
          :collection-uuid="collectionStore.active.collection_uuid"
          :chain-id="collectionStore.active.chain"
          @submit-success="onNftTransferred"
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
const modalNestMintCollectionVisible = ref<boolean | null>(false);
const modalBurnTokensVisible = ref<boolean | null>(false);
const modalTransferOwnershipVisible = ref<boolean | null>(false);

/** Polling */
let collectionInterval: any = null as any;
let transactionInterval: any = null as any;

/** Collection UUID from route */
const collectionUuid = ref<string>(`${params?.id}` || `${params?.slug}` || '');

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

onMounted(() => {
  collectionStore.getCollection(collectionUuid.value);

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const currentCollection = await collectionStore.getCollection(collectionUuid.value);

    /** Reset state if user opens different collection */
    if (collectionUuid.value !== collectionStore.active?.collection_uuid) {
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

function onNftNestMinted() {
  modalNestMintCollectionVisible.value = false;
  setTimeout(() => {
    collectionStore.fetchCollectionTransactions(collectionStore.active.collection_uuid, false);

    setTimeout(() => {
      checkUnfinishedTransactions();
    }, 3000);
  }, 3000);
}

function onNftBurned() {
  modalBurnTokensVisible.value = false;

  setTimeout(() => {
    collectionStore.fetchCollectionTransactions(collectionStore.active.collection_uuid);
  }, 300);
}

function onNftTransferred() {
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
  if (collectionStore.active.collectionStatus === CollectionStatus.CREATED) {
    return;
  }
  if (collectionStore.active.collectionStatus >= CollectionStatus.DEPLOYED) {
    clearInterval(collectionInterval);
    return;
  }

  clearInterval(collectionInterval);
  collectionInterval = setInterval(async () => {
    const collection = await collectionStore.fetchCollection(collectionUuid.value);
    await collectionStore.fetchCollectionTransactions(
      collectionStore.active.collection_uuid,
      false
    );
    if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      if (collection) {
        collectionStore.active = collection;
      }
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

  clearInterval(transactionInterval);
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

      const newCollection = await collectionStore.fetchCollection(collectionUuid.value);
      if (newCollection) {
        collectionStore.active = newCollection;
      }
    }
  }, 30000);
}
</script>
