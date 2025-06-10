<template>
  <ModalFullScreen
    :progress="progress"
    :steps="CollectionCreateStep"
    :active-step="metadataStore.stepCollectionCreate"
    trans-key="nft.collection.createStep"
    :title="$t('nft.collection.create')"
    :minimize="Math.max(metadataStore.stepCollectionCreate, metadataStore.stepMetadata) > 1"
  >
    <slot>
      <NftMetadataWizard
        v-if="metadataStore.stepCollectionCreate === CollectionCreateStep.METADATA"
        ref="metadataRef"
      />
      <FormNftCollectionSmartContract
        v-else-if="metadataStore.stepCollectionCreate === CollectionCreateStep.SMART_CONTRACT"
        ref="formSmartContractRef"
        class="mx-auto max-w-lg"
        hide-submit
      />
      <div v-else-if="metadataStore.stepCollectionCreate === CollectionCreateStep.VISUAL" class="mx-auto max-w-lg">
        <h4>{{ $t(`nft.collection.createStep.${CollectionCreateStep.VISUAL}`) }}</h4>
        <p>{{ $t('nft.collection.instruction.visuals') }}</p>
        <FormNftCollectionVisual ref="formVisualRef" class="my-6" hide-submit />
      </div>
      <NftPreviewCollection
        v-else-if="metadataStore.stepCollectionCreate === CollectionCreateStep.REVIEW"
        @back="metadataStore.stepCollectionCreate = CollectionCreateStep.SMART_CONTRACT"
        @deploy="createCollection()"
      />
      <AnimationDeploy
        v-else-if="metadataStore.stepCollectionCreate === CollectionCreateStep.DEPLOYING"
        class="min-h-full"
      />
      <NftCollectionDeployed
        v-if="metadataStore.stepCollectionCreate === CollectionCreateStep.DEPLOYED"
        class="mx-auto max-w-5xl"
      />
    </slot>
    <template v-if="metadataStore.stepCollectionCreate < CollectionCreateStep.REVIEW" #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>{{ $t('nft.collection.review.totalCosts') }}: </strong>
          <span>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn v-if="showBack" class="min-w-40" type="secondary" @click="back">
            {{ $t('general.back') }}
          </Btn>
          <Btn class="min-w-40" @click="nextStep">
            <template v-if="metadataStore.stepMetadata === NftMetadataStep.SINGLE">
              {{ $t('nft.add') }}
            </template>
            <template v-else>{{ $t('form.continue') }}</template>
          </Btn>
        </div>
      </div>
    </template>
  </ModalFullScreen>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { CollectionCreateStep, NftMetadataStep } from '~/lib/types/nft';

const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

const { t } = useI18n();
const { uploadFiles } = useUpload();
const { isUnique, collectionEndpoint, prepareFormData } = useCollection();
const { pricing, deployCollection, uploadLogoAndCover } = useMetadata();

const metadataRef = useTemplateRef('metadataRef');
const formVisualRef = useTemplateRef('formVisualRef');
const formSmartContractRef = useTemplateRef('formSmartContractRef');

const totalCredits = computed(() => sumCredits(pricing.value));
const showBack = computed(
  () =>
    metadataStore.stepMetadata !== NftMetadataStep.CHAIN ||
    metadataStore.stepCollectionCreate !== CollectionCreateStep.METADATA
);

const metadataProgress = computed(() => {
  switch (metadataStore.stepMetadata) {
    case NftMetadataStep.CHAIN:
    case NftMetadataStep.METADATA:
    case NftMetadataStep.NEW:
      return 10 * (metadataStore.stepMetadata - 1);
    case NftMetadataStep.SINGLE:
    case NftMetadataStep.CSV:
    case NftMetadataStep.ENDPOINT:
    case NftMetadataStep.JSON:
      return 10 * (NftMetadataStep.SINGLE - 1);
    default:
      return 10 * (NftMetadataStep.SINGLE_PREVIEW - 1);
  }
});
const progress = computed(() => Math.min(100, metadataProgress.value + 10 * metadataStore.stepCollectionCreate));

onMounted(async () => {
  await dataStore.waitOnPromises();
  storageStore.getStorageInfo();
  paymentStore.getPriceList();
});

const metadataValid = () => !metadataStore.metadata.some(item => !item.image || !item.name || !item.description);

async function submitFormVisual() {
  if (await formVisualRef.value?.handleSubmitForm()) {
    metadataStore.stepCollectionCreate = CollectionCreateStep.REVIEW;
  }
}

function back() {
  switch (metadataStore.stepCollectionCreate) {
    case CollectionCreateStep.METADATA:
      metadataRef.value?.back();
      break;
    case CollectionCreateStep.SMART_CONTRACT:
      formSmartContractRef.value?.back();
      break;
    default:
      metadataStore.stepCollectionCreate -= 1;
  }
}
function nextStep() {
  switch (metadataStore.stepCollectionCreate) {
    case CollectionCreateStep.METADATA:
      metadataRef.value?.nextStep();
      break;
    case CollectionCreateStep.SMART_CONTRACT:
      formSmartContractRef.value?.nextStep();
      break;
    case CollectionCreateStep.VISUAL:
      submitFormVisual();
      break;
    case CollectionCreateStep.REVIEW:
      break;
    default:
      metadataStore.stepCollectionCreate = CollectionCreateStep.METADATA;
  }
}

async function createCollection() {
  if (!metadataValid()) {
    message.warning(t('validation.nft.metadata'));
    return;
  }

  metadataStore.stepCollectionCreate = CollectionCreateStep.DEPLOYING;
  try {
    const collection = isUnique.value ? await deployUniqueCollection() : await deployNftCollection();
    collectionStore.active = collection;
    collectionStore.items.push(collection);
    collectionStore.resetCache();
    metadataStore.form.single.collectionUuid = collection.collection_uuid;

    metadataStore.stepCollectionCreate = CollectionCreateStep.DEPLOYED;
  } catch (error) {
    message.error(userFriendlyMsg(error));
    metadataStore.stepCollectionCreate = CollectionCreateStep.REVIEW;
  }
}

async function deployNftCollection(): Promise<CollectionInterface> {
  const { data } = await $api.post<CollectionResponse>(collectionEndpoint(), prepareFormData());
  await uploadLogoAndCover(data.bucket_uuid);
  await deployCollection(data, true);

  return data;
}

async function deployUniqueCollection(): Promise<CollectionInterface> {
  const bucketUuid = await createBucket(metadataStore.form.smartContract.name);
  const body = await prepareUniqueData(bucketUuid);

  const req = await fetch(APISettings.basePath + endpoints.collectionsUnique, {
    method: 'POST',
    body,
    headers: {
      Authorization: 'Bearer ' + authStore.jwt,
      Accept: '*/*',
    },
  });
  const { data } = await $api.onResponse<CollectionResponse>(req);

  await uploadLogoAndCover(bucketUuid);

  return data;
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
