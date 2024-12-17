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
          {{ t('nft.deploy.single') }}
        </Btn>
      </NftPreview>
    </div>
    <NftPreviewFinish
      v-else-if="
        collectionStore.nftStep === NftCreateStep.DEPLOY &&
        collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOYED
      "
      :show-footer="!isUnique"
    >
      <div v-if="isUnique" class="mt-4">
        <Btn :to="`/dashboard/service/nft/${collectionStore.active.collection_uuid}`" size="large">
          Open NFT Collection
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
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { getFile } = useComputing();
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

    const metadata = await prepareUniqueData(bucketUuid);

    const res = await $api.post<CollectionResponse>(endpoints.collectionsUnique, metadata);
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

  /** Get images links */
  const imageLinks: Record<string, string | null> = {};

  if (collectionStore.images[0] && collectionStore.images[0]?.file_uuid) {
    const file = await getFile(bucketUuid, collectionStore.images[0].file_uuid);
    imageLinks[file.name] = file.link;
  }
  const filesChunks = sliceIntoChunks([...collectionStore.images], 100);

  for (let i = 1; i <= filesChunks.length; i++) {
    const uploadedImages = await bucketStore.fetchDirectoryContent({
      bucketUuid: bucketUuid,
      page: i,
      limit: 100,
    });
    uploadedImages.forEach(img => {
      imageLinks[img.name] = img.link;
    });
  }

  /** Prepare metadata */
  const baseData = prepareFormData();
  const metadata = collectionStore.metadata.reduce((acc, meta: Record<string, any>, key: number) => {
    const id = Number(meta.id) || key + 1;
    const m = Object.assign({}, meta);
    delete m.id;
    m.image = meta.image in imageLinks ? imageLinks[meta.image] : meta.image;
    acc[id] = m;
    return acc;
  }, {});

  return { ...baseData, metadata, bucket_uuid: bucketUuid };
}

async function createBucket(name: string) {
  const bodyData = {
    project_uuid: dataStore.projectUuid,
    bucketType: BucketType.NFT_METADATA,
    name: `NFT Collection: ${name}`,
  };

  try {
    const res = await $api.post<BucketResponse>(endpoints.buckets, bodyData);
    return res.data.bucket_uuid;
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  return null;
}
</script>
