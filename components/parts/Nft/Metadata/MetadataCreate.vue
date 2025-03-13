<template>
  <W3Warn v-model:show="modalW3WarnVisible" @submit="modalW3WarnVisible = false">
    {{ t('w3Warn.nft.collection') }}
  </W3Warn>
</template>

<script setup lang="ts">
import { CollectionStatus } from '~/lib/types/nft';

const emit = defineEmits(['submitSuccess']);
const { t, te } = useI18n();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const warningStore = useWarningStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

const { isUnique, prepareFormData } = useCollection();
const { deployCollection, getPriceServiceName, uploadLogoAndCover } = useMetadata();
const { uploadFiles } = useUpload();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const metadataValid = () => !metadataStore.metadata.some(item => !item.image || !item.name || !item.description);

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

  try {
    await deployCollection(
      collectionStore.active,
      collectionStore.active.collectionStatus === CollectionStatus.CREATED
    );

    collectionStore.resetCache();
  } catch (error) {
    /** Deployment status 
    collectionStore.nftStep = NftCreateStep.PREVIEW;
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;*/

    message.error(userFriendlyMsg(error));
  }
}

async function deployUnique() {
  modalW3WarnVisible.value = false;

  try {
    const bucketUuid = await createBucket(metadataStore.form.smartContract.name);
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
    metadataStore.form.single.collectionUuid = res.data.collection_uuid;

    /** Uploads logo and cover image */
    await uploadLogoAndCover(bucketUuid);

    /** Deployment status 
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;*/

    collectionStore.resetCache();

    /** Emit events */
    emit('submitSuccess');
  } catch (error) {
    /** Deployment status 
    collectionStore.nftStep = NftCreateStep.PREVIEW;
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;*/

    message.error(userFriendlyMsg(error));
  }
}

async function prepareUniqueData(bucketUuid: string) {
  await uploadFiles(bucketUuid, metadataStore.images, false);

  /** Prepare metadata */
  const metadata = metadataStore.metadata.reduce(
    (acc: Record<number, MetadataItem>, meta: MetadataItem, key: number) => {
      /** Get image link from calculatedCids */
      const image = Object.values(bucketStore.calculatedCids).find(fileInfo => fileInfo.name === meta.image);

      const id = Number(meta.id) || key + 1;
      const m = Object.assign({}, meta);
      delete m.id;
      m.image = image?.link || meta.image;
      acc[id] = m;
      return acc;
    },
    {}
  );

  const body = new FormData();
  body.append('bucket_uuid', bucketUuid);

  const baseData = prepareFormData();
  Object.entries(baseData).forEach(([key, value]) => {
    if (value !== undefined) {
      body.append(key, value as any);
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
