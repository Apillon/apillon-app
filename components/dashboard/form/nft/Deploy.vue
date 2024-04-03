<template>
  <div class="flex justify-center items-center" style="min-height: calc(100dvh - 300px)">
    <div
      v-if="
        isStepAvailable(NftDeployStep.DEPLOY) && collectionStore.stepDeploy === NftDeployStep.DEPLOY
      "
      class="w-full pb-8"
    >
      <div v-if="deployStatus > 0" class="text-center">
        <AnimationLoader />
        <h2>{{ $t('nft.deploy.deploying') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          <span v-if="deployStatus === NftDeployStatus.CREATING">
            {{ $t('nft.deploy.collection') }}
          </span>
          <span v-else-if="deployStatus === NftDeployStatus.UPLOADING">
            {{ $t('nft.deploy.metadata') }}
          </span>
          <span v-if="deployStatus === NftDeployStatus.DEPLOYING">
            {{ $t('nft.deploy.nft') }}
          </span>
        </p>
      </div>
      <NftPreviewCards v-else>
        <Btn class="max-w-lg w-full" type="primary" @click="w3WarnAndDeploy">
          {{ $t('nft.collection.deploy') }}
        </Btn>
      </NftPreviewCards>
    </div>

    <div
      v-else-if="
        isStepAvailable(NftDeployStep.BEHAVIOR) &&
        collectionStore.stepDeploy === NftDeployStep.BEHAVIOR
      "
    >
      <div class="text-center">
        <h2>{{ $t('nft.metadata.titleCollectionBehavior') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          {{ $t('nft.metadata.infoCollectionBehavior') }}
        </p>
      </div>
      <FormNftCollectionBehavior />
    </div>

    <div v-else class="w-full max-w-lg">
      <div class="text-center">
        <h2>{{ $t('nft.metadata.titleCollectionName') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          {{ $t('nft.metadata.infoCollectionName') }}
        </p>
      </div>
      <FormNftCollectionBase />
    </div>

    <W3Warn
      v-model:show="modalW3WarnVisible"
      :btn-text="$t('nft.collection.upload')"
      @submit="onModalW3WarnConfirm"
    >
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const emit = defineEmits(['submitSuccess']);

const $i18n = useI18n();
const message = useMessage();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { prepareFormData } = useCollection();
const { deployCollection, getPriceServiceName } = useNft();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const deployStatus = ref<number>(0);

function isStepAvailable(step: number) {
  if (step === NftDeployStep.DEPLOY) {
    return (
      !!collectionStore.form.behavior.revocable !== null &&
      !!collectionStore.form.behavior.soulbound !== null &&
      isStepAvailable(NftDeployStep.BEHAVIOR)
    );
  } else if (step === NftDeployStep.BEHAVIOR) {
    return !!collectionStore.form.base.name && !!collectionStore.form.base.symbol;
  }
  return true;
}

/** When user close W3Warn, allow him to create new collection */
function onModalW3WarnConfirm() {
  warningStore.showSpendingWarning(getPriceServiceName(), () => deploy());
}

function w3WarnAndDeploy() {
  if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && $i18n.te('w3Warn.nft.new')) {
    modalW3WarnVisible.value = true;
  } else {
    onModalW3WarnConfirm();
  }
}

async function deploy() {
  deployStatus.value = NftDeployStatus.CREATING;

  try {
    const res = await $api.post<CollectionResponse>(endpoints.collections(), prepareFormData());
    collectionStore.active = res.data;

    /** Deployment status */
    deployStatus.value = NftDeployStatus.UPLOADING;

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    await deployCollection();

    /** Deployment status */
    deployStatus.value = NftDeployStatus.DEPLOYING;

    collectionStore.resetMetadata();
    collectionStore.resetForms();
    bucketStore.resetData();

    /** Deployment status */
    deployStatus.value = NftDeployStatus.DEPLOYED;

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    /** Deployment status */
    deployStatus.value = NftDeployStatus.IDLE;

    message.error(userFriendlyMsg(error));
  }
}
</script>
