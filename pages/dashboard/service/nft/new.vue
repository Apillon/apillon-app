<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderNftNew />
      </div>
    </template>

    <slot>
      <div v-if="collectionStore.metadataStored" class="mx-auto max-w-lg py-4 mobile:relative">
        <div class="relative text-center">
          <h2>{{ t('nft.collection.create') }}</h2>
          <p class="mb-8 whitespace-pre-line text-body">
            {{ t('nft.collection.createInfo') }}
          </p>
        </div>
        <FormNftCollection />
        <button class="absolute left-0 top-6 md:top-[42px]" @click="collectionStore.metadataStored = null">
          <span class="icon-back align-sub text-2xl"></span>
        </button>
      </div>
      <div v-else class="relative">
        <FormInstructions :title="t('nft.collection.data')" :instructions="[t('nft.collection.instruction.data')]">
          <FormNftCollectionBase ref="formBaseRef" hide-submit />
        </FormInstructions>

        <FormInstructions
          :title="t('nft.collection.data')"
          :instructions="[t('nft.collection.instruction.smartContract')]"
        >
          <FormNftCollectionBehavior ref="formBehaviorRef" hide-submit />
        </FormInstructions>

        <FormInstructions class="!p-0">
          <Btn type="primary" size="large" :loading="false" :disabled="false" @click="w3WarnAndDeploy">
            {{ t('nft.collection.create') }}
          </Btn>
        </FormInstructions>

        <!--
        <div class="flex-cc" style="min-height: calc(70dvh - 50px)">
          <div
            v-if="collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOY_INITIATED"
            class="w-full pb-8 text-center"
          >
            <AnimationLoader />
            <h2>{{ t('nft.deploy.creatingCollection') }}</h2>
            <p class="mb-8 whitespace-pre-line text-body">
              <span>
                {{ t('nft.deploy.collection') }}
              </span>
            </p>
          </div>

          <div v-else class="pb-8">
            <NftPreviewCollection />
            <Btn type="primary" class="mb-2 w-full" @click="w3WarnAndDeploy()">
              {{ t('nft.collection.deploy') }}
            </Btn>
          </div>
        </div>

        <FormNftCreateMetadata deploy-collection :style="isLg ? scrollStyle : {}" />
        -->

        <!-- Button back -->
        <button
          v-if="
            collectionStore.metadataStored !== null &&
            collectionStore.stepCollectionDeploy !== CollectionStatus.DEPLOY_INITIATED &&
            collectionStore.nftStep !== NftCreateStep.PREVIEW &&
            collectionStore.nftStep !== NftCreateStep.DEPLOY &&
            (collectionStore.nftStep !== NftCreateStep.AMOUNT || collectionStore.mintTab !== NftCreateTab.DEPLOY)
          "
          class="absolute left-0 top-2 md:top-3"
          @click="goToPreviousStep"
        >
          <span class="icon-back align-sub text-2xl"></span>
        </button>

        <!-- Buttons switch preview
        <div v-if="collectionStore.nftStep === NftCreateStep.PREVIEW" class="absolute right-0 top-2 flex items-center">
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
        </div>-->
      </div>

      <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
        {{ t('w3Warn.nft.collection') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { useMessage } from 'naive-ui';

const { t, te } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { isLg } = useScreen();
const { uploadFiles } = useUpload();
const { getPriceServiceName } = useNft();
const { collectionEndpoint, prepareFormData, prepareLogoAndCover } = useCollection();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

useHead({
  title: t('dashboard.nav.nft'),
});

const headingRef = ref<HTMLElement>();
const formBaseRef = useTemplateRef('formBaseRef');
const formBehaviorRef = useTemplateRef('formBehaviorRef');

const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await resetAndAddNft();

  /** Get Price list */
  await paymentStore.getPriceList();
});

const submitFormBase = () => (formBaseRef.value ? formBaseRef.value.handleSubmitForm() : false);
const submitFormBehavior = () => (formBehaviorRef.value ? formBehaviorRef.value.handleSubmitForm() : false);

function w3WarnAndDeploy() {
  if (submitFormBase() && submitFormBehavior()) {
    if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new')) {
      modalW3WarnVisible.value = true;
    } else {
      onModalW3WarnConfirm();
    }
  }
}

async function onModalW3WarnConfirm() {
  warningStore.showSpendingWarning(getPriceServiceName(), () => createCollection());
}

async function createCollection() {
  modalW3WarnVisible.value = false;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;

  try {
    const res = await $api.post<CollectionResponse>(collectionEndpoint(), prepareFormData());
    collectionStore.active = res.data;

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    collectionStore.form.single.collectionUuid = res.data.collection_uuid;

    /** Prepares logo and cover image for upload */
    const images = prepareLogoAndCover();

    /** Uploads logo and cover image */
    await uploadFiles(res.data.bucket_uuid, images);

    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;

    /** Redirects to NFT Create tab */
    collectionStore.mintTab = NftCreateTab.DEPLOY;
  } catch (error) {
    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;

    message.error(userFriendlyMsg(error));
  }
}

async function resetAndAddNft() {
  bucketStore.resetFolder();
  bucketStore.resetUpload();
  collectionStore.resetForms();
  collectionStore.resetMetadata();
  collectionStore.metadataStored = null;

  await sleep(200);
  await Promise.all(Object.values(dataStore.promises)).then(async _ => {
    storageStore.getStorageInfo();
    await collectionStore.getCollections();

    pageLoading.value = false;
  });
}

function goToPreviousStep() {
  switch (collectionStore.mintTab) {
    case NftCreateTab.METADATA:
      if (collectionStore.step === CollectionStep.ENVIRONMENT) {
        collectionStore.step = CollectionStep.STORAGE_TYPE;
        collectionStore.metadataStored = null;
      } else if (collectionStore.step === CollectionStep.METADATA) {
        collectionStore.step = CollectionStep.ENVIRONMENT;
      } else if (collectionStore.step === CollectionStep.BEHAVIOR) {
        collectionStore.step = CollectionStep.METADATA;
      }
      return;
    case NftCreateTab.PREVIEW:
      collectionStore.mintTab = NftCreateTab.METADATA;
      collectionStore.step = CollectionStep.BEHAVIOR;
      return;
    case NftCreateTab.DEPLOY:
      switch (collectionStore.nftStep) {
        case NftCreateStep.AMOUNT:
          return;
        case NftCreateStep.SINGLE:
          collectionStore.nftStep = NftCreateStep.AMOUNT;
          return;
        case NftCreateStep.MULTIPLE:
          if (collectionStore.stepUpload === NftUploadStep.FILE) {
            collectionStore.nftStep = NftCreateStep.AMOUNT;
          }
          if (collectionStore.stepUpload === NftUploadStep.IMAGES) {
            collectionStore.stepUpload = NftUploadStep.FILE;
          }
          return;
        case NftCreateStep.PREVIEW:
          if (collectionStore.amount === NftAmount.MULTIPLE) {
            collectionStore.nftStep = NftCreateStep.MULTIPLE;
            collectionStore.stepUpload = NftUploadStep.IMAGES;
          } else {
            collectionStore.nftStep = NftCreateStep.SINGLE;
            collectionStore.metadata.pop();
            collectionStore.images.pop();
          }
          return;
      }
      return;
    default:
      collectionStore.metadataStored = null;
  }
}
</script>
