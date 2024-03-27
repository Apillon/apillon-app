<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <n-space align="center" size="large">
            <h2>
              <span class="text-bodyDark">{{ $t('dashboard.nav.nft') }}/</span>
              {{ $t('general.create') }}
            </h2>
          </n-space>
        </slot>
        <template #info>
          <n-space :size="32" align="center">
            <ModalCreditCosts :service="ServiceTypeName.NFT" filter-by-chain />

            <Badge icon="nft/moonbeam">
              <NuxtIcon name="nft/astar_logo" class="icon-auto ml-2" filled />
            </Badge>
          </n-space>
        </template>
      </Heading>
    </template>

    <slot>
      <div v-if="collectionStore.metadataStored" class="max-w-lg mx-auto py-4">
        <div class="text-center">
          <h2>{{ $t('nft.collection.create') }}</h2>
          <p class="mb-8 text-body whitespace-pre-line">
            {{ $t('nft.collection.createInfo') }}
          </p>
        </div>
        <FormNftCollection />
        <button class="absolute left-0 top-[42px]" @click="collectionStore.metadataStored = null">
          <span class="icon-back text-2xl align-sub"></span>
        </button>
      </div>
      <div v-else class="relative">
        <n-tabs
          ref="mintTabsRef"
          v-model:value="collectionStore.mintTab"
          type="bar"
          :bar-width="0"
          size="large"
          justify-content="center"
          animated
        >
          <!-- COLLECTION METADATA -->
          <n-tab-pane
            :name="NftCreateTab.METADATA"
            :disabled="collectionStore.mintTab === NftCreateTab.DEPLOY"
          >
            <template #tab>
              <IconNumber
                v-if="collectionStore.mintTab === NftCreateTab.METADATA"
                :number="1"
                :active="true"
              />
              <IconSuccessful v-else />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.create') }}</span>
            </template>
            <slot>
              <NftCollectionForms />
            </slot>
          </n-tab-pane>

          <!-- COLLECTION PREVIEW -->
          <n-tab-pane :name="NftCreateTab.PREVIEW" disabled>
            <template #tab>
              <IconSuccessful v-if="collectionStore.mintTab === NftCreateTab.DEPLOY" />
              <IconNumber
                v-else
                :number="2"
                :active="collectionStore.mintTab === NftCreateTab.PREVIEW"
              />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.previewTab') }}</span>
            </template>
            <slot>
              <div class="flex-cc" style="min-height: calc(100dvh - 300px)">
                <div
                  v-if="collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOY_INITIATED"
                  class="w-full pb-8"
                >
                  <div v-if="collectionStore.stepCollectionDeploy > 0" class="text-center">
                    <AnimationLoader />
                    <h2>{{ $t('nft.deploy.creatingCollection') }}</h2>
                    <p class="mb-8 text-body whitespace-pre-line">
                      <span>
                        {{ $t('nft.deploy.collection') }}
                      </span>
                    </p>
                  </div>
                </div>
                <div v-else class="pb-8">
                  <NftPreviewCollection />
                  <Btn type="primary" class="w-full mb-2" @click="w3WarnAndDeploy()">
                    {{ $t('form.proceed') }}
                  </Btn>
                </div>
              </div>
            </slot>
          </n-tab-pane>

          <!-- DEPLOY -->
          <n-tab-pane :name="NftCreateTab.DEPLOY">
            <template #tab>
              <IconNumber :number="3" :active="collectionStore.mintTab === NftCreateTab.DEPLOY" />
              <span class="ml-2 text-sm text-white">{{ $t('nft.add') }}</span>
            </template>
            <slot>
              <FormNftCreateMetadata />
            </slot>
          </n-tab-pane>
        </n-tabs>
        <!-- Button back -->
        <button
          v-if="
            collectionStore.metadataStored !== null &&
            collectionStore.stepCollectionDeploy !== CollectionStatus.DEPLOY_INITIATED &&
            collectionStore.nftStep !== NftCreateStep.PREVIEW
          "
          class="absolute left-0 top-3"
          @click="goToPreviousStep"
        >
          <span class="icon-back text-2xl align-sub"></span>
        </button>

        <!-- Buttons switch preview-->
        <div
          v-if="collectionStore.nftStep === NftCreateStep.PREVIEW"
          class="absolute right-0 top-2 flex items-center"
        >
          <span class="mr-2">{{ $t('general.view') }}:</span>
          <n-button
            class="w-10 px-0"
            :class="{ '!bg-bg-lighter ': !collectionStore.gridView }"
            size="small"
            type="tertiary"
            quaternary
            round
            @click="collectionStore.gridView = false"
          >
            <span class="icon-list-view text-2xl align-sub"></span>
          </n-button>
          <n-button
            class="w-10 px-0"
            :class="{ '!bg-bg-lighter ': collectionStore.gridView }"
            size="small"
            type="tertiary"
            quaternary
            round
            @click="collectionStore.gridView = true"
          >
            <span class="icon-grid-view text-2xl align-sub"></span>
          </n-button>
        </div>
      </div>

      <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
        {{ $t('w3Warn.nft.collection') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import type { TabsInst } from 'naive-ui';
import { useMessage } from 'naive-ui';

const { t, te } = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { uploadFiles } = useUpload();
const { getPriceServiceName } = useNft();
const { prepareFormData } = useCollection();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

useHead({
  title: t('dashboard.nav.nft'),
});

const pageLoading = ref<boolean>(true);
const mintTabsRef = ref<TabsInst | null>(null);

const images = ref<Array<FileListItemType>>([]);

onMounted(() => {
  resetAndAddNft();

  /** Get Price list */
  paymentStore.getPriceList();
});

function w3WarnAndDeploy() {
  if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new')) {
    modalW3WarnVisible.value = true;
  } else {
    onModalW3WarnConfirm();
  }
}

async function onModalW3WarnConfirm() {
  warningStore.showSpendingWarning(getPriceServiceName(), () => deploy());
}

function prepareImagesForUpload() {
  const cover = collectionStore.form.base.coverImage;
  const logo = collectionStore.form.base.logo;

  if (logo) {
    logo.name = 'logo.' + logo.name.split('.')[logo.name.split('.').length - 1];
    images.value.push(logo);
  }
  if (cover) {
    cover.name = 'cover.' + cover.name.split('.')[cover.name.split('.').length - 1];
    images.value.push(cover);
  }
}

async function deploy() {
  modalW3WarnVisible.value = false;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;

  try {
    const res = await $api.post<CollectionResponse>(endpoints.collections(), prepareFormData());
    collectionStore.active = res.data;

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    collectionStore.form.single.collectionUuid = res.data.collection_uuid;

    /** Prepares logo and cover image for upload */
    prepareImagesForUpload();

    /** Uploads logo and cover image */
    await uploadFiles(res.data.bucket_uuid, images.value);

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

function resetAndAddNft() {
  collectionStore.metadataStored = null;
  collectionStore.resetMetadata();
  collectionStore.resetForms();

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await storageStore.getStorageInfo();
      await collectionStore.getCollections();

      pageLoading.value = false;
    });
  }, 100);
}

function goToPreviousStep() {
  switch (collectionStore.mintTab) {
    case NftCreateTab.METADATA:
      if (collectionStore.step === CollectionStep.METADATA) {
        collectionStore.step = CollectionStep.ENVIRONMENT;
        collectionStore.metadataStored = null;
      }
      if (collectionStore.step === CollectionStep.BEHAVIOR) {
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
