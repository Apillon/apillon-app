<template>
  <div
    class="relative w-full"
    :class="{ 'flex-cc': collectionStore.nftStep !== NftCreateStep.PREVIEW }"
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
    <NftPreviewFinish
      v-else-if="
        collectionStore.nftStep === NftCreateStep.DEPLOY &&
        collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOYED
      "
      show-footer
    />
    <div v-else-if="collectionStore.nftStep === NftCreateStep.DEPLOY" class="w-full pb-8">
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
const props = defineProps({ deployCollection: { type: Boolean, default: false } });
const emit = defineEmits(['submitSuccess']);

const { t, te } = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();

const { deployCollection } = useNft();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

function w3WarnAndDeploy() {
  if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new') && t('w3Warn.nft.new')) {
    modalW3WarnVisible.value = true;
  } else {
    onModalW3WarnConfirm();
  }
}

async function onModalW3WarnConfirm() {
  if (!metadataValid()) {
    message.warning(t('validation.nftMetadata'));
  } else {
    deploy();
  }
}

function metadataValid(): boolean {
  return !collectionStore.metadata.some(item => !item.image || !item.name || !item.description);
}

async function deploy() {
  modalW3WarnVisible.value = false;
  collectionStore.nftStep = NftCreateStep.DEPLOY;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;

  try {
    await deployCollection(props.deployCollection);

    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;
    collectionStore.resetCache();

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    /** Deployment status */
    collectionStore.nftStep = NftCreateStep.PREVIEW;
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;

    message.error(userFriendlyMsg(error));
  }
}
</script>
