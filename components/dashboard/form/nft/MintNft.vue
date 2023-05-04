<template>
  <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
    <div
      v-if="
        isStepAvailable(NftDeployStep.DEPLOY) && collectionStore.stepDeploy === NftDeployStep.DEPLOY
      "
      class="w-full"
    >
      <NftPreview>
        <Btn class="max-w-lg w-full" type="primary" :loading="loading" @click="deploy">
          {{ $t('nft.collection.deploy') }}
        </Btn>
      </NftPreview>
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
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const emit = defineEmits(['submitSuccess']);
const { deployCollection } = useNft();

const message = useMessage();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();

const loading = ref<boolean>(false);

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

async function deploy() {
  loading.value = true;
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

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    await deployCollection();

    /** Reset collection qouta limit, metadata, forms */
    collectionStore.quotaReached = undefined;
    collectionStore.resetMetadata();
    collectionStore.resetForms();

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
