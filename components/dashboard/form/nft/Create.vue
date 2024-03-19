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
        <FormNftUpload />
      </div>
    </div>
    <div
      v-else-if="collectionStore.nftStep === NftCreateStep.SINGLE"
      class="justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <div>
        <FormNftUploadSingle />
      </div>
    </div>
    <!-- Preview -->
    <div
      v-else-if="collectionStore.nftStep === NftCreateStep.PREVIEW"
      class="flex justify-center items-center"
      style="min-height: calc(100dvh - 300px)"
    >
      <div>
        <NftPreview>
          <Btn class="w-60" type="secondary" @click="handleAddAnother()">
            {{ $t('nft.upload.addNft') }}
          </Btn>
          <Btn class="w-60" type="primary" @click="modalW3WarnVisible = true">
            {{ $t('nft.deploy.single') }}
          </Btn>
        </NftPreview>
      </div>
    </div>
    <div
      v-else-if="collectionStore.nftStep === NftCreateStep.DEPLOY"
      class="justify-center items-center flex"
      style="min-height: calc(100dvh - 300px)"
    >
      <div
        v-if="collectionStore.stepCollectionDeploy !== CollectionStatus.DEPLOYED"
        class="w-full pb-8"
      >
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
    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script setup lang="ts">
const collectionStore = useCollectionStore();

const { deployCollection, addNft } = useNft();

const router = useRouter();

const modalW3WarnVisible = ref<boolean>(false);

async function onModalW3WarnConfirm() {
  collectionStore.nftStep = NftCreateStep.DEPLOY;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;

  modalW3WarnVisible.value = false;

  await deploy();

  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;

  router.push(`/dashboard/service/nft/${collectionStore.form.single.collectionUuid}`);
}

function handleAddAnother() {
  if (collectionStore.amount === 1) {
    collectionStore.resetFile();
  } else {
    collectionStore.resetSingleFormData();
  }
  collectionStore.nftStep = NftCreateStep.AMOUNT;
  collectionStore.stepUpload = NftUploadStep.FILE;
}

async function deploy() {
  if (collectionStore.active.collectionStatus === CollectionStatus.CREATED) {
    await deployCollection();
  } else {
    await addNft();
  }
}
</script>
