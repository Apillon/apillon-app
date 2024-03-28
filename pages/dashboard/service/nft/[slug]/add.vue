<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <n-space align="center" size="large">
            <h2>
              <span class="text-bodyDark">{{ $t('dashboard.nav.nft') }}/</span>
              {{ $t('general.create') }}
            </h2>
          </n-space>
        </slot>
        <template #info>
          <n-space :size="32" align="center">
            <ModalCreditCosts
              :service="ServiceTypeName.NFT"
              :chain="collectionStore.active.chain"
              filter-by-chain
            />

            <Badge icon="nft/moonbeam">
              <NuxtIcon name="nft/astar_logo" class="icon-auto ml-2" filled />
            </Badge>
          </n-space>
        </template>
      </Heading>
    </template>

    <slot>
      <div>
        <FormNftCreateMetadata />
        <button
          v-if="
            collectionStore.nftStep !== NftCreateStep.AMOUNT &&
            collectionStore.nftStep !== NftCreateStep.DEPLOY
          "
          class="absolute left-0 top-10"
          @click="goToPreviousStep"
        >
          <span class="icon-back text-2xl align-sub"></span>
        </button>
      </div>
      <!-- Buttons switch preview-->
      <div
        v-if="collectionStore.nftStep === NftCreateStep.PREVIEW"
        class="absolute right-4 top-4 flex items-center"
      >
        <span class="mr-2">{{ $t('general.view') }}:</span>
        <n-button
          class="w-10 px-0"
          :class="{ '!bg-bg-lighter ': !collectionStore.gridView }"
          size="small"
          type="tertiary"
          quaternary
          round
          @click="collectionStore.gridView = false"
        >
          <span class="icon-list-view text-2xl align-sub"></span>
        </n-button>
        <n-button
          class="w-10 px-0"
          :class="{ '!bg-bg-lighter ': collectionStore.gridView }"
          size="small"
          type="tertiary"
          quaternary
          round
          @click="collectionStore.gridView = true"
        >
          <span class="icon-grid-view text-2xl align-sub"></span>
        </n-button>
      </div>
      <W3Warn v-model:show="modalW3WarnVisible" @submit="modalW3WarnVisible = false">
        {{ $t('w3Warn.nft.collection') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();

const modalW3WarnVisible = ref<boolean>(false);
const pageLoading = ref<boolean>(true);

/** Collection UUID from route */
const collectionUuid = ref<string>(`${params?.slug}`);

onMounted(async () => {
  if (!params?.slug) router.push({ name: 'dashboard-service-nft' });

  /** Get Price list */
  paymentStore.getPriceList();

  const currentCollection = await collectionStore.getCollection(collectionUuid.value);

  if (!currentCollection?.collection_uuid) {
    router.push({ name: 'dashboard-service-nft' });
  } else {
    /** Reset state if user opens different collection */
    if (collectionUuid.value !== collectionStore.active?.collection_uuid) {
      collectionStore.resetMetadata();
    }
    resetAndAddNft();

    pageLoading.value = false;
    collectionStore.active = currentCollection;
    collectionStore.form.single.collectionUuid = currentCollection.collection_uuid;
  }
});

function resetAndAddNft() {
  collectionStore.resetMetadata();
  collectionStore.resetForms();

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await storageStore.getStorageInfo();

      pageLoading.value = false;
    });
  }, 100);
}

function goToPreviousStep() {
  switch (collectionStore.nftStep) {
    case NftCreateStep.AMOUNT:
      return;
    case NftCreateStep.SINGLE:
      collectionStore.nftStep = NftCreateStep.AMOUNT;
      return;
    case NftCreateStep.MULTIPLE:
      if (collectionStore.stepUpload === NftUploadStep.FILE) {
        collectionStore.nftStep = NftCreateStep.AMOUNT;
      }
      if (collectionStore.stepUpload === NftUploadStep.IMAGES) {
        collectionStore.stepUpload = NftUploadStep.FILE;
      }
      return;
    case NftCreateStep.PREVIEW:
      if (collectionStore.amount === NftAmount.MULTIPLE) {
        collectionStore.nftStep = NftCreateStep.MULTIPLE;
        collectionStore.stepUpload = NftUploadStep.IMAGES;
      } else {
        collectionStore.nftStep = NftCreateStep.SINGLE;
      }
      return;
    default:
      collectionStore.nftStep = NftCreateStep.AMOUNT;
  }
}
</script>
