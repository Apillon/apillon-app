<template>
  <div
    v-bind="$attrs"
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
          <template v-if="isUnique">{{ t('nft.deploy.unique') }}</template>
          <template v-else>
            {{ t('nft.deploy.single') }}
          </template>
        </Btn>
      </NftPreview>
    </div>
    <NftPreviewFinish
      v-else-if="
        collectionStore.nftStep === NftCreateStep.DEPLOY &&
        collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOYED
      "
      :chain="collectionStore.active.chain"
      :show-footer="!isUnique"
    >
      <div v-if="isUnique" class="mt-4">
        <Btn :to="`/dashboard/service/nft/${collectionStore.active.collection_uuid}`" size="large">
          {{ $t('nft.openCollection') }}
        </Btn>
      </div>
    </NftPreviewFinish>
    <div v-else-if="collectionStore.nftStep === NftCreateStep.DEPLOY" class="w-full pb-8">
      <AnimationDeploy />
    </div>

    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
      {{ t('w3Warn.nft.new') }}
    </W3Warn>
  </div>

  <!-- Buttons switch preview-->
  <div v-if="collectionStore.nftStep === NftCreateStep.PREVIEW" class="absolute right-4 top-4 flex items-center">
    <span class="mr-2">{{ t('general.view') }}:</span>
    <n-button
      class="w-10 px-0"
      :class="{ '!bg-bg-lighter': !collectionStore.gridView }"
      size="small"
      type="tertiary"
      quaternary
      round
      @click="collectionStore.gridView = false"
    >
      <span class="icon-list-view align-sub text-2xl"></span>
    </n-button>
    <n-button
      class="w-10 px-0"
      :class="{ '!bg-bg-lighter': collectionStore.gridView }"
      size="small"
      type="tertiary"
      quaternary
      round
      @click="collectionStore.gridView = true"
    >
      <span class="icon-grid-view align-sub text-2xl"></span>
    </n-button>
  </div>
  <W3Warn v-model:show="modalW3WarnVisible" @submit="modalW3WarnVisible = false">
    {{ t('w3Warn.nft.collection') }}
  </W3Warn>
</template>

<script setup lang="ts">
import { CollectionStatus, NftCreateStep } from '~/lib/types/nft';

const emit = defineEmits(['submitSuccess']);
const { t, te } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();
const { isUnique, prepareFormData } = useCollection();
const { deployCollection, getPriceServiceName, uploadLogoAndCover } = useNft();
const { uploadFiles } = useUpload();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const metadataValid = () => !collectionStore.metadata.some(item => !item.image || !item.name || !item.description);

function w3WarnAndDeploy() {
  if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new') && t('w3Warn.nft.new')) {
    modalW3WarnVisible.value = true;
  } else {
    onModalW3WarnConfirm();
  }
}

async function onModalW3WarnConfirm() {
  if (!metadataValid()) {
    message.warning(t('validation.nft.metadata'));
  } else if (isUnique.value) {
    warningStore.showSpendingWarning(getPriceServiceName(), () => deployUnique());
  } else {
    deploy();
  }
}

async function deploy() {
  modalW3WarnVisible.value = false;
  collectionStore.nftStep = NftCreateStep.DEPLOY;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;

  try {
    await deployCollection(collectionStore.active.collectionStatus === CollectionStatus.CREATED);

    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;
    collectionStore.resetCache();
  } catch (error) {
    /** Deployment status */
    collectionStore.nftStep = NftCreateStep.PREVIEW;
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;

    message.error(userFriendlyMsg(error));
  }
}

async function deployUnique() {
  modalW3WarnVisible.value = false;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;
  collectionStore.nftStep = NftCreateStep.DEPLOY;

  try {
    const bucketUuid = await createBucket(collectionStore.form.base.name);
    if (!bucketUuid) return;

    const body = await prepareUniqueData(bucketUuid);

    const req = await fetch(APISettings.basePath + endpoints.collectionsUnique, {
      method: 'POST',
      body,
      headers: {
        Authorization: 'Bearer ' + authStore.jwt,
        Accept: '*/*',
      },
    });

    const res = await $api.onResponse<CollectionResponse>(req);
    collectionStore.active = res.data;

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);
    collectionStore.form.single.collectionUuid = res.data.collection_uuid;

    /** Uploads logo and cover image */
    await uploadLogoAndCover(bucketUuid);

    /** Deployment status */
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

async function prepareUniqueData(bucketUuid: string) {
  await uploadFiles(bucketUuid, collectionStore.images, false);

  /** Prepare metadata */
  const metadata = collectionStore.metadata.reduce((acc, meta: Record<string, any>, key: number) => {
    /** Get image link from calculatedCids */
    const image = Object.values(bucketStore.calculatedCids).find(fileInfo => fileInfo.name === meta.image);

    const id = Number(meta.id) || key + 1;
    const m = Object.assign({}, meta);
    delete m.id;
    m.image = image?.link || meta.image;
    acc[id] = m;
    return acc;
  }, {});

  const body = new FormData();
  body.append('bucket_uuid', bucketUuid);

  const baseData = prepareFormData();
  Object.entries(baseData).forEach(([key, value]) => {
    if (value !== undefined) {
      body.append(key, value);
    }
  });

  const metadataFile = new Blob([JSON.stringify(metadata, null, 2)], {
    type: 'application/json',
  });
  body.append('metadata', metadataFile);

  return body;
}

async function createBucket(name: string) {
  const bodyData = {
    project_uuid: dataStore.projectUuid,
    bucketType: BucketType.NFT_METADATA,
    name: `NFT Collection: ${name}`,
  };

  const res = await $api.post<BucketResponse>(endpoints.buckets, bodyData);
  return res.data.bucket_uuid;
}
</script>
