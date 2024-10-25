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
const dataStore = useDataStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { getFile } = useComputing();
const { isUnique, prepareFormData } = useCollection();
const { deployCollection, getPriceServiceName, uploadLogoAndCover } = useNft();
const { uploadFiles } = useUpload();
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
  } else if (isUnique.value) {
    warningStore.showSpendingWarning(getPriceServiceName(), () => deployUnique());
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
    await uploadLogoAndCover(res.data.bucket_uuid);

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
  const imageLinks: Record<string, string> = {};
  for (let i = 0; i < collectionStore.images.length; i += 1) {
    const img = collectionStore.images[i];
    if (img?.file_uuid) {
      const file = await getFile(bucketUuid, img.file_uuid);
      imageLinks[file.name] = file.link;
    }
  }

  /** Prepare metadata */
  const baseData = prepareFormData();
  const metadata = Object.values(collectionStore.metadata).reduce((acc, meta, key) => {
    const id = Number(meta.id) || key + 1;
    const m = Object.assign({}, meta);
    delete m.id;
    m.image = imageLinks[meta.image];
    acc[id] = m;
    return acc;
  }, {});

  return { ...baseData, metadata };
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
