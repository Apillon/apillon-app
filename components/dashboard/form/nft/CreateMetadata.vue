<template>
  <div
    class="relative w-full"
    :class="{ 'flex-cc': collectionStore.nftStep !== NftCreateStep.PREVIEW }"
    style="min-height: calc(100dvh - 300px)"
  >
    <FormNftAmountOption v-if="collectionStore.nftStep === NftCreateStep.AMOUNT" />
    <FormNftUpload v-else-if="collectionStore.nftStep === NftCreateStep.MULTIPLE" />
    <FormNftUploadSingle v-else-if="collectionStore.nftStep === NftCreateStep.SINGLE" />

    <!-- Preview -->
    <div v-else-if="collectionStore.nftStep === NftCreateStep.PREVIEW" class="pt-8">
      <NftPreview>
        <Btn class="w-60" type="primary" @click="w3WarnAndDeploy()">
          {{ $t('nft.deploy.single') }}
        </Btn>
      </NftPreview>
    </div>
    <div
      v-else-if="
        collectionStore.nftStep === NftCreateStep.DEPLOY &&
        collectionStore.stepCollectionDeploy !== CollectionStatus.DEPLOYED
      "
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

    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script setup lang="ts">
const { te } = useI18n();
const collectionStore = useCollectionStore();
const warningStore = useWarningStore();

const { deployCollection, getPriceServiceName } = useNft();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const router = useRouter();

function w3WarnAndDeploy() {
  if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new')) {
    modalW3WarnVisible.value = true;
  } else {
    onModalW3WarnConfirm();
  }
}

async function onModalW3WarnConfirm() {
  warningStore.showSpendingWarning(getPriceServiceName(), () => deploy());
}

async function deploy() {
  collectionStore.nftStep = NftCreateStep.DEPLOY;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;

  modalW3WarnVisible.value = false;

  await deployCollection(collectionStore.active.collectionStatus !== CollectionStatus.CREATED);

  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;

  router.push(`/dashboard/service/nft/${collectionStore.form.single.collectionUuid}`);
}
</script>
