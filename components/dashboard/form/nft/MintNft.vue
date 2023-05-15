<template>
  <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
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
        <Btn class="max-w-lg w-full" type="primary" @click="deploy">
          {{ $t('nft.collection.deploy') }}
        </Btn>
      </NftPreviewCards>
    </div>

    <div
      v-else-if="
        isStepAvailable(NftDeployStep.BEHAVIOUR) &&
        collectionStore.stepDeploy === NftDeployStep.BEHAVIOUR
      "
    >
      <div class="text-center">
        <h2>{{ $t('nft.metadata.titleCollectionBehaviour') }}</h2>
        <p class="mb-8 text-body whitespace-pre-line">
          {{ $t('nft.metadata.infoCollectionBehaviour') }}
        </p>
      </div>
      <FormNftCollectionBehaviour />
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
      @update:show="onModalW3WarnConfirm"
    >
      {{ $t('w3Warn.nft.new') }}
    </W3Warn>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const emit = defineEmits(['submitSuccess']);
const { deployCollection } = useNft();

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();

const deployStatus = ref<number>(0);
const modalW3WarnVisible = ref<boolean>(false);
const modalW3WarnShown = ref<boolean>(false);

function isStepAvailable(step: number) {
  if (step === NftDeployStep.DEPLOY) {
    return (
      !!collectionStore.form.behaviour.revocable !== null &&
      !!collectionStore.form.behaviour.soulbound !== null &&
      isStepAvailable(NftDeployStep.BEHAVIOUR)
    );
  } else if (step === NftDeployStep.BEHAVIOUR) {
    return !!collectionStore.form.base.name && !!collectionStore.form.base.symbol;
  }
  return true;
}

/** When user close W3Warn, allow him to create new collection */
async function onModalW3WarnConfirm(value: boolean) {
  if (!value) {
    await deploy();
  }
}

/** Watch modalW3WarnVisible, onShow update timestamp of shown modal in session storage */
watch(
  () => modalW3WarnVisible.value,
  shown => {
    if (shown) {
      modalW3WarnShown.value = true;
      sessionStorage.setItem(LsW3WarnKeys.NFT_NEW, Date.now().toString());
    }
  }
);

async function deploy() {
  if (
    !modalW3WarnShown.value &&
    !sessionStorage.getItem(LsW3WarnKeys.NFT_NEW) &&
    $i18n.te('w3Warn.nft.new')
  ) {
    modalW3WarnVisible.value = true;
    return;
  }

  deployStatus.value = NftDeployStatus.CREATING;
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      name: collectionStore.form.base.name,
      symbol: collectionStore.form.base.symbol,
      chain: collectionStore.form.base.chain,
      baseExtension: collectionStore.form.behaviour.baseExtension,
      mintPrice: collectionStore.form.behaviour.mintPrice,
      maxSupply:
        collectionStore.form.behaviour.supplyLimited === 1
          ? collectionStore.form.behaviour.maxSupply
          : 0,
      isDrop: collectionStore.form.behaviour.isDrop,
      dropStart: Math.floor((collectionStore.form.behaviour.dropStart || Date.now()) / 1000),
      reserve: collectionStore.form.behaviour.reserve || 0,
      isRevokable: collectionStore.form.behaviour.revocable,
      isSoulbound: collectionStore.form.behaviour.soulbound,
      royaltiesAddress: collectionStore.form.behaviour.royaltiesAddress,
      royaltiesFees: collectionStore.form.behaviour.royaltiesFees,
    };
    const res = await $api.post<CollectionResponse>(endpoints.collections(), bodyData);
    collectionStore.active = res.data;

    /** Deployment status */
    deployStatus.value = NftDeployStatus.UPLOADING;

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    await deployCollection();

    /** Deployment status */
    deployStatus.value = NftDeployStatus.DEPLOYING;

    /** Reset collection qouta limit, metadata, forms */
    collectionStore.quotaReached = undefined;
    collectionStore.resetMetadata();
    collectionStore.resetForms();

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  /** Deployment status */
  deployStatus.value = NftDeployStatus.DEPLOYED;
}
</script>
