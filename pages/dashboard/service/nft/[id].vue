<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderNftCollection />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <div class="flex gap-8">
          <div class="card-light flex-1 rounded-lg px-6 py-4">
            <NftCollectionInfo
              :base-uri-link="collectionBaseUri"
              :cover-image="coverImage || ''"
              :logo-image="logoImage || ''"
              :loading="loadingBucket"
            />
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
                <n-button @click="$router.push(`/dashboard/service/nft/${collectionStore.active.collection_uuid}/add`)">
                  <span class="icon-add mr-2 text-xl text-primary"></span>
                  <span class="text-primary">{{ $t('nft.add') }}</span>
                </n-button>
              </div>
              <TableNftNfts
                v-else-if="collectionBaseUri && collectionMaxSupply"
                :base-uri="collectionBaseUri"
                :total="collectionMaxSupply"
              />
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
const nftStore = useNftStore();
const dataStore = useDataStore();
const ipfsStore = useIpfsStore();
const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const paymentStore = usePaymentStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();
const { checkUnfinishedCollection, checkUnfinishedTransactions } = useCollection();

const pageLoading = ref<boolean>(true);
const loadingBucket = ref<boolean>(true);
const modalMintCollectionVisible = ref<boolean | null>(false);
const modalBurnTokensVisible = ref<boolean | null>(false);
const modalTransferOwnershipVisible = ref<boolean | null>(false);
const modalSetBaseUriVisible = ref<boolean | null>(false);

const collectionUuid = ref<string>(`${params?.id}`);
const collectionBaseUri = ref<string>();
const collectionMaxSupply = ref<number>(0);
const transactionHash = ref<string | null>('');
const logoImage = ref<Optional<string> | undefined>();
const coverImage = ref<Optional<string> | undefined>();
const tab = ref(collectionStore.active.collectionStatus === CollectionStatus.CREATED ? Tabs.NFTs : Tabs.DEPLOYS);

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  if (!params?.id) router.push({ name: 'dashboard-service-nft' });

  const currentCollection = await collectionStore.getCollection(collectionUuid.value);

  /** Reset state if user opens different collection */
  if (collectionUuid.value !== collectionStore.active?.collection_uuid) {
    metadataStore.resetMetadata();
    nftStore.items = [];
  }

  if (!currentCollection?.collection_uuid) {
    router.push({ name: 'dashboard-service-nft' });
  } else {
    loadBaseUri(currentCollection.baseUri);
    loadBucket(currentCollection);
    await collectionStore.getMetadataDeploys(currentCollection.collection_uuid);
    await collectionStore.getCollectionTransactions(currentCollection.collection_uuid);
    collectionStore.active = currentCollection;
    pageLoading.value = false;

    storageStore.getStorageInfo();
    paymentStore.getPriceList();

    checkUnfinishedCollection();
    checkUnfinishedTransactions();
  }
});

/** Watch collectionStatus, if status changed from Created to Initiated, start polling */
watch(
  () => collectionStore.active?.collectionStatus,
  (status, oldStatus) => {
    if (status === CollectionStatus.DEPLOY_INITIATED && oldStatus === CollectionStatus.CREATED) {
      checkUnfinishedCollection();
    }
  }
);

async function loadBaseUri(url?: Optional<string>) {
  if (!url) return;
  const parts = removeLastSlash(url).split('/');
  if (parts.length) {
    const type = url.includes('ipns') ? IpfsType.IPNS : IpfsType.CID;
    const projectUuid = await dataStore.getProjectUuid();
    const ipfsLink = await ipfsStore.fetchIpfsLink(projectUuid, parts[parts.length - 1], type);
    collectionBaseUri.value = ipfsLink?.link;
  }
}

async function loadBucket(collection: CollectionInterface) {
  collectionMaxSupply.value = collection.maxSupply;
  if (!collection.bucket_uuid) return;

  if (collection.maxSupply > 0 && collection.logoUrl && collection.bannerUrl) {
    coverImage.value = collection.bannerUrl;
    logoImage.value = collection.logoUrl;
  } else {
    const bucketFiles = await bucketStore.fetchDirectoryContent({
      bucketUuid: collection.bucket_uuid,
    });
    loadingBucket.value = false;

    logoImage.value =
      collection.logoUrl ||
      bucketFiles.find(item => item.type === BucketItemType.FILE && item.name.includes('logo'))?.link;
    coverImage.value =
      collection.bannerUrl ||
      bucketFiles.find(item => item.type === BucketItemType.FILE && item.name.includes('cover'))?.link;

    const metadataFolder = bucketFiles.find(
      item => item.type === BucketItemType.DIRECTORY && item.name.includes('Metadata')
    );
    if (metadataFolder && collection.maxSupply === 0) {
      await bucketStore.fetchDirectoryContent({
        bucketUuid: collection.bucket_uuid,
        folderUuid: metadataFolder.uuid,
        limit: 1,
      });
      collectionMaxSupply.value = Number(bucketStore.folder.pagination.itemCount || 0);
    }
  }
}

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
</script>
