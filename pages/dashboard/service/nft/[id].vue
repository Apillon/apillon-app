<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderNftCollection />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <div class="flex gap-8">
          <div class="card-light flex-1 rounded-lg px-6 py-4">
            <NftCollectionInfo />
          </div>

          <div class="card max-w-64 px-6 py-4">
            <h6 class="mb-2">{{ $t('general.actions') }}</h6>
            <ActionsNftCollection
              @add-nfts="$router.push(`/dashboard/service/nft/${collectionStore.active.collection_uuid}/add`)"
              @mint="modalMintCollectionVisible = true"
              @revoke="modalBurnTokensVisible = true"
              @transfer="modalTransferOwnershipVisible = true"
              @set-base-uri="modalSetBaseUriVisible = true"
            />
          </div>
        </div>
        <n-tabs v-model:value="tab" type="line" size="large" class="min-h-64" animated>
          <n-tab-pane
            :name="Tabs.TRANSACTIONS"
            :disabled="collectionStore.active.collectionStatus === CollectionStatus.CREATED"
          >
            <template #tab>
              <span class="ml-2 text-sm text-white">
                {{ $t('nft.transaction.title') }}
              </span>
            </template>
            <slot>
              <TableNftTransaction :transactions="collectionStore.transaction" />
            </slot>
          </n-tab-pane>
          <n-tab-pane
            :name="Tabs.DEPLOYS"
            :disabled="collectionStore.active.collectionStatus === CollectionStatus.CREATED"
          >
            <template #tab>
              <span class="ml-2 text-sm text-white">
                {{ $t('nft.metadata.deployTitle') }}
              </span>
            </template>
            <slot>
              <TableNftMetadataDeploys
                v-if="collectionStore.active.bucket_uuid"
                :deploys="collectionStore.metadataDeploys"
              />
            </slot>
          </n-tab-pane>
          <n-tab-pane :name="Tabs.NFTs">
            <template #tab>
              <span class="ml-2 text-sm text-white">
                {{ $t('dashboard.nav.nft') }}
              </span>
            </template>
            <slot>
              <div v-if="collectionStore.active.collectionStatus === CollectionStatus.CREATED">
                <p class="my-4">{{ $t('nft.transaction.empty') }}</p>
                <!-- Add NFT -->
                <n-button @click="openModalAddNfts">
                  <span class="icon-add mr-2 text-xl text-primary"></span>
                  <span class="text-primary">{{ $t('nft.add') }}</span>
                </n-button>
              </div>
              <!-- Links to NFT templates -->
              <NftPreviewFinish
                v-else-if="collectionStore.active.chainType === ChainType.EVM && !collectionStore.active.websiteUuid"
                :chain="collectionStore.active.chain"
              />
              <div v-else-if="collectionStore.active.websiteUuid">
                <p class="my-4">
                  {{ $t('nft.collection.websiteConnected') }}
                </p>

                <Btn type="primary" :to="`/dashboard/service/hosting/${collectionStore.active.websiteUuid}`">
                  {{ $t('nft.collection.showWebsite') }}
                </Btn>
              </div>
            </slot>
          </n-tab-pane>
        </n-tabs>
      </n-space>

      <!-- Modal - Collection Mint -->
      <modal v-model:show="modalMintCollectionVisible" class="dropdown-grid" :title="t('nft.collection.mint')">
        <FormNftMint :collection="collectionStore.active" @submit-success="onNftMinted" />
      </modal>

      <!-- Modal - Burn Tokens -->
      <modal v-model:show="modalBurnTokensVisible" :title="$t('nft.collection.burn.title')">
        <FormNftBurn :collection="collectionStore.active" @submit-success="onNftBurned" />
      </modal>

      <!-- Modal - Collection Transfer -->
      <modal v-model:show="modalTransferOwnershipVisible" :title="$t('nft.collection.transfer')">
        <FormNftTransfer
          :collection-uuid="collectionStore.active.collection_uuid"
          :chain-id="collectionStore.active.chain"
          @submit-success="onNftTransferred"
        />
      </modal>

      <!-- Modal - Collection Set base URI -->
      <modal v-model:show="modalSetBaseUriVisible" :title="$t('nft.collection.setBaseUri')">
        <FormNftSetBaseUri
          :collection-uuid="collectionStore.active.collection_uuid"
          :chain-id="collectionStore.active.chain"
          @submit-success="onBaseUriChanged"
        />
      </modal>

      <ModalTransaction
        v-if="transactionHash"
        :transaction-hash="transactionHash"
        :chain-id="collectionStore.active.chain"
        @close="transactionHash = ''"
      />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
enum Tabs {
  TRANSACTIONS = 'transactions',
  DEPLOYS = 'deploys',
  NFTs = 'nfts',
}

const { t } = useI18n();
const router = useRouter();
const { params } = useRoute();
const storageStore = useStorageStore();
const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

const pageLoading = ref<boolean>(true);
const modalMintCollectionVisible = ref<boolean | null>(false);
const modalBurnTokensVisible = ref<boolean | null>(false);
const modalTransferOwnershipVisible = ref<boolean | null>(false);
const modalSetBaseUriVisible = ref<boolean | null>(false);
const transactionHash = ref<string | null>('');
const tab = ref(collectionStore.active.collectionStatus === CollectionStatus.CREATED ? Tabs.NFTs : Tabs.DEPLOYS);

/** Polling */
let collectionInterval: any = null as any;
let transactionInterval: any = null as any;

/** Collection UUID from route */
const collectionUuid = ref<string>(`${params?.id}`);

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  if (!params?.id) router.push({ name: 'dashboard-service-nft' });

  const currentCollection = await collectionStore.getCollection(collectionUuid.value);

  /** Reset state if user opens different collection */
  if (collectionUuid.value !== collectionStore.active?.collection_uuid) {
    metadataStore.resetMetadata();
  }

  if (!currentCollection?.collection_uuid) {
    router.push({ name: 'dashboard-service-nft' });
  } else {
    await collectionStore.getMetadataDeploys(currentCollection.collection_uuid);
    await collectionStore.getCollectionTransactions(currentCollection.collection_uuid);
    collectionStore.active = currentCollection;
    pageLoading.value = false;

    storageStore.getStorageInfo();
    paymentStore.getPriceList();

    checkIfCollectionUnfinished();
    checkUnfinishedTransactions();
  }
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

function onNftMinted(hash: string) {
  modalMintCollectionVisible.value = false;
  transactionHash.value = hash;

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
  collectionStore.active.collectionStatus = CollectionStatus.TRANSFERRED;

  setTimeout(() => {
    collectionStore.fetchCollections();

    setTimeout(() => {
      checkUnfinishedTransactions();
    }, 10000);
  }, 3000);
}

function onBaseUriChanged(collection: CollectionInterface) {
  modalSetBaseUriVisible.value = false;
  collectionStore.active = collection;
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
    if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      if (collection) {
        collectionStore.active = collection;
        await collectionStore.fetchCollectionTransactions(collectionStore.active.collection_uuid, false);
      }
      clearInterval(collectionInterval);

      /** On collection deploy, start transaction polling */
      checkUnfinishedTransactions();
    }
  }, 10000);
}

/** Transactions polling */
function checkUnfinishedTransactions() {
  const unfinishedTransaction = collectionStore.transaction.find(
    transaction => transaction.transactionStatus < TransactionStatus.CONFIRMED
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
    const transaction = transactions.find(transaction => transaction.id === unfinishedTransaction.id);
    if (!transaction || transaction.transactionStatus >= TransactionStatus.CONFIRMED) {
      clearInterval(transactionInterval);

      const newCollection = await collectionStore.fetchCollection(collectionUuid.value);
      if (newCollection) {
        collectionStore.active = newCollection;
      }
    }
  }, 10000);
}
</script>
