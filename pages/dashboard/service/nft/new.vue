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
        <button class="absolute left-0 top-[42px]" @click="goToPreviousStep">
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
            :name="NftMintTab.METADATA"
            :disabled="collectionStore.mintTab === NftMintTab.MINT"
          >
            <template #tab>
              <IconNumber
                v-if="collectionStore.mintTab === NftMintTab.METADATA"
                :number="1"
                :active="true"
              />
              <IconSuccessful v-else />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.create') }}</span>
            </template>
            <slot>
              <FormNftCollectionCreate />
            </slot>
          </n-tab-pane>

          <!-- COLLECTION PREVIEW -->
          <n-tab-pane :name="NftMintTab.PREVIEW" disabled>
            <template #tab>
              <IconSuccessful v-if="collectionStore.mintTab === NftMintTab.MINT" />
              <IconNumber
                v-else
                :number="2"
                :active="collectionStore.mintTab === NftMintTab.PREVIEW"
              />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.previewTab') }}</span>
            </template>
            <slot>
              <div
                class="justify-center items-center flex"
                style="min-height: calc(100dvh - 300px)"
              >
                <div
                  v-if="collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOY_INITIATED"
                  class="w-full pb-8"
                >
                  <div v-if="collectionStore.stepCollectionDeploy > 0" class="text-center">
                    <AnimationLoader />
                    <h2>{{ $t('nft.deploy.deployingCollection') }}</h2>
                    <p class="mb-8 text-body whitespace-pre-line">
                      <span>
                        {{ $t('nft.deploy.collection') }}
                      </span>
                    </p>
                  </div>
                </div>
                <div v-else>
                  <FormNftCollectionPreview />
                  <Btn type="primary" class="w-full mb-2" @click="modalW3WarnVisible = true">
                    {{ $t('form.proceed') }}
                  </Btn>
                </div>
              </div>
            </slot>
          </n-tab-pane>

          <!-- MINT -->
          <n-tab-pane :name="NftMintTab.MINT">
            <template #tab>
              <IconNumber :number="3" :active="collectionStore.mintTab === NftMintTab.MINT" />
              <span class="ml-2 text-sm text-white">{{ $t('nft.add') }}</span>
            </template>
            <slot>
              <FormNftCreate />
            </slot>
          </n-tab-pane>
        </n-tabs>
        <!-- Button back -->
        <button
          v-if="
            collectionStore.metadataStored !== null &&
            collectionStore.stepCollectionDeploy !== CollectionStatus.DEPLOY_INITIATED &&
            collectionStore.nftStep !== NftCreateStep.AMOUNT &&
            collectionStore.nftStep !== NftCreateStep.PREVIEW
          "
          class="absolute left-0 top-[10px]"
          @click="goToPreviousStep"
        >
          <span class="icon-back text-2xl align-sub"></span>
        </button>

        <!-- Buttons switch preview-->
        <div
          v-if="collectionStore.stepUpload === NftUploadStep.PREVIEW"
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

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();
const { uploadFiles } = useUpload();

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

const pageLoading = ref<boolean>(true);
const modalW3WarnVisible = ref<boolean>(false);
const mintTabsRef = ref<TabsInst | null>(null);

const images = ref<Array<FileListItemType>>([]);

onMounted(() => {
  resetAndAddNft();
});

async function onModalW3WarnConfirm() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  if (collectionStore.mintTab === NftMintTab.PREVIEW) {
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;
    await deploy();
    collectionStore.mintTab = NftMintTab.MINT;

    modalW3WarnVisible.value = false;
  } else {
    modalW3WarnVisible.value = false;
  }
}

function prepareImagesForUpload() {
  const cover = collectionStore.form.base.coverImage;
  const logo = collectionStore.form.base.logo;

  cover.name = 'cover.' + cover.name.split('.')[cover.name.split('.').length - 1];

  logo.name = 'logo.' + logo.name.split('.')[logo.name.split('.').length - 1];

  images.value.push(cover);
  images.value.push(logo);
}

async function deploy() {
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
      royaltiesAddress:
        collectionStore.form.behavior.royaltiesFees === 0
          ? null
          : collectionStore.form.behavior.royaltiesAddress,
      royaltiesFees: collectionStore.form.behavior.royaltiesFees,
    };
    const res = await $api.post<CollectionResponse>(endpoints.collections(), bodyData);
    collectionStore.active = res.data;

    /** On new collection created add new collection to list */
    collectionStore.items.push(res.data);

    collectionStore.form.single.collectionUuid = res.data.collection_uuid;

    prepareImagesForUpload();

    await uploadFiles(res.data.bucket_uuid, images.value);

    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYING;

    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;

    collectionStore.mintTab = NftMintTab.MINT;
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
    case NftMintTab.METADATA:
      if (collectionStore.step === CollectionStep.METADATA) {
        collectionStore.step = CollectionStep.ENVIRONMENT;
        collectionStore.metadataStored = null;
      }
      if (collectionStore.step === CollectionStep.BEHAVIOR) {
        collectionStore.step = CollectionStep.METADATA;
      }
      return;
    case NftMintTab.PREVIEW:
      collectionStore.mintTab = NftMintTab.METADATA;
      collectionStore.step = CollectionStep.BEHAVIOR;
      return;
    case NftMintTab.MINT:
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
          if (collectionStore.stepUpload === NftUploadStep.PREVIEW) {
            collectionStore.stepUpload = NftUploadStep.IMAGES;
          }
          return;
      }
      return;
    default:
      collectionStore.metadataStored = null;
  }
}
</script>
