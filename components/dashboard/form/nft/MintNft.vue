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
const emit = defineEmits(['submitSuccess']);
const { deployCollection } = useNft();

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const collectionStore = useCollectionStore();

const deployStatus = ref<number>(0);
const modalW3WarnVisible = ref<boolean>(false);
const modalW3WarnShown = ref<boolean>(false);

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
async function onModalW3WarnConfirm() {
  await deploy();
}

/** Watch modalW3WarnVisible, onShow update timestamp of shown modal in session storage */
watch(
  () => modalW3WarnVisible.value,
  shown => {
    if (shown) {
      modalW3WarnShown.value = true;
      localStorage.setItem(LsW3WarnKeys.NFT_NEW, Date.now().toString());
    }
  }
);

async function deploy() {
  if (
    !modalW3WarnShown.value &&
    !localStorage.getItem(LsW3WarnKeys.NFT_NEW) &&
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
      collectionType: collectionStore.form.base.collectionType,
      baseExtension: collectionStore.form.behavior.baseExtension,
      dropPrice: collectionStore.form.behavior.dropPrice,
      maxSupply:
        collectionStore.form.behavior.supplyLimited === 1
          ? collectionStore.form.behavior.maxSupply
          : 0,
      drop: collectionStore.form.behavior.drop,
      dropStart: Math.floor((collectionStore.form.behavior.dropStart || Date.now()) / 1000),
      dropReserve: collectionStore.form.behavior.dropReserve || 0,
      isRevokable: collectionStore.form.behavior.revocable,
      isSoulbound: collectionStore.form.behavior.soulbound,
      royaltiesAddress: collectionStore.form.behavior.royaltiesAddress,
      royaltiesFees: collectionStore.form.behavior.royaltiesFees,
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
