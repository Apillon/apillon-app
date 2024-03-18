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
            <ModalCreditCosts :service="ServiceTypeName.NFT" filter-by-chain />

            <Badge icon="nft/moonbeam">
              <NuxtIcon name="nft/astar_logo" class="icon-auto ml-2" filled />
            </Badge>
          </n-space>
        </template>
      </Heading>
    </template>

    <slot>
      <div>
        <FormNftCreate />
        <button
          v-if="collectionStore.nftStep !== NftCreateStep.AMOUNT"
          class="absolute left-0 top-[10px]"
          @click="goToPreviousStep"
        >
          <span class="icon-back text-2xl align-sub"></span>
        </button>
      </div>
      <!-- Buttons switch preview-->
      <div
        v-if="collectionStore.stepUpload === NftUploadStep.PREVIEW"
        class="absolute right-0 top-2 flex items-center"
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
const dataStore = useDataStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();

const modalW3WarnVisible = ref<boolean>(false);
const pageLoading = ref<boolean>(true);

onMounted(() => {
  resetAndAddNft();
});

function resetAndAddNft() {
  collectionStore.metadataStored = null;
  collectionStore.resetMetadata();
  collectionStore.resetForms();

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await storageStore.getStorageInfo();
      await collectionStore.getCollections();

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
      if (collectionStore.stepUpload === NftUploadStep.PREVIEW) {
        collectionStore.stepUpload = NftUploadStep.IMAGES;
      }
      return;
    default:
      collectionStore.nftStep = NftCreateStep.AMOUNT;
  }
}
</script>
