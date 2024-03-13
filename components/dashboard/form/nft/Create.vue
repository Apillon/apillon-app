<template>
  <div>
    <div
      v-if="collectionStore.nftStep === NftCreateStep.AMOUNT"
      class="text-center justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <FormNftAmountOption />
    </div>
    <div
      v-else-if="collectionStore.nftStep === NftCreateStep.MULTIPLE"
      class="justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <div>
        <FormNftUpload @submit="modalW3WarnVisible = true" />
      </div>
    </div>
    <div
      v-else-if="collectionStore.nftStep === NftCreateStep.SINGLE"
      class="justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <div>
        <FormNftUploadSingle @submit="modalW3WarnVisible = true" />
      </div>
    </div>
    <div
      v-else-if="collectionStore.nftStep === NftCreateStep.DEPLOY"
      class="justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <div class="w-full pb-8">
        <div class="text-center">
          <AnimationLoader />
          <h2>{{ $t('nft.deploy.deployingCollection') }}</h2>
          <p class="mb-8 text-body whitespace-pre-line">
            <span>
              {{ $t('nft.deploy.collection') }}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="justify-center items-center flex" style="min-height: calc(100dvh - 300px)">
      <div>
        <FormNftPreview />
      </div>
    </div>

    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script setup lang="ts">
const collectionStore = useCollectionStore();

const modalW3WarnVisible = ref<boolean>(false);

async function onModalW3WarnConfirm() {
  collectionStore.nftStep = NftCreateStep.DEPLOY;
  /*  await deploy(); */
  collectionStore.nftStep = NftCreateStep.PREVIEW;

  modalW3WarnVisible.value = false;
}

function handleDeploy() {}
</script>
