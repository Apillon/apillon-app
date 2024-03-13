<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <div v-if="collectionCreated">
            <h2>{{ $t('nft.collection.display') }}</h2>
          </div>
          <n-space v-else align="center" size="large">
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
      <div v-if="collectionCreated">
        <div class="flex justify-center items-center" style="min-height: calc(100dvh - 300px)">
          <div class="w-full max-w-lg text-center">
            <NuxtIcon name="nft/collection" class="flex justify-center icon-auto mb-4" filled />
            <h2>{{ $t('nft.collection.created.title') }}</h2>
            <p class="mb-2 text-body whitespace-pre-line">
              {{ $t('nft.collection.created.info') }}
            </p>

            <div class="mb-2 flex items-center justify-center text-body">
              <p>{{ $t('nft.collection.createToDisplay') }}&nbsp;</p>
              <a href="https://github.com/Apillon/nft-template-vue/fork" target="_blank">
                <Btn type="builders" size="tiny"> Vue </Btn>
              </a>
              <p>,&nbsp;</p>
              <a href="https://github.com/Apillon/nft-template-react/fork" target="_blank">
                <Btn type="builders" size="tiny"> React </Btn>
              </a>
              <p>&nbsp;{{ $t('general.or') }}&nbsp;</p>
              <a href="https://github.com/Apillon/nft-template/fork" target="_blank">
                <Btn type="builders" size="tiny"> javascript template </Btn>
              </a>
              <p>.</p>
            </div>
            <SeparatorText class="my-4" :border-left="true">
              {{ $t('general.or') }}
            </SeparatorText>
            <NuxtLink to="/dashboard/service/nft">
              <Btn type="primary" size="large">
                {{ $t('nft.collection.created.goBack') }}
              </Btn>
            </NuxtLink>
          </div>
        </div>
        <div class="relative border-t-1 border-bg-lighter pt-6 px-5">
          <IconInfo
            v-if="$i18n.te('w3Warn.nft.new')"
            class="absolute top-4 left-0"
            @click="modalW3WarnVisible = true"
          />
          <p class="mb-2 text-center text-body">
            <span class="inline-block mx-1">{{ $t('nft.collection.created.view') }}</span>
            <a
              :href="
                transactionLink(
                  collectionStore.active.transactionHash,
                  collectionStore.active.chain
                )
              "
              target="_blank"
            >
              <Btn type="builders" size="tiny">
                <span class="text-sm">{{ $t('nft.collection.created.explorer') }}</span>
              </Btn>
            </a>
            <span class="inline-block mx-1">{{ $t('nft.collection.created.or') }}</span>

            <Btn
              type="builders"
              size="tiny"
              :loading="loadingBucket"
              @click="openBucket(collectionStore.active.bucket_uuid || '')"
            >
              <span class="text-sm">{{ $t('nft.collection.created.bucket') }}</span>
            </Btn>
          </p>
        </div>
      </div>
      <div v-else-if="collectionStore.metadataStored" class="max-w-lg mx-auto py-4">
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
          <n-tab-pane :name="NftMintTab.METADATA">
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
          <n-tab-pane :name="NftMintTab.PREVIEW">
            <template #tab>
              <IconSuccessful v-if="collectionStore.mintTab === NftMintTab.MINT" />
              <IconNumber
                v-else
                :number="2"
                :active="collectionStore.mintTab === NftMintTab.PREVIEW"
              />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.uploadData') }}</span>
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
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.mintNfts') }}</span>
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
const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();
const { loadingBucket, openBucket } = useStorage();

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

const pageLoading = ref<boolean>(true);
const modalW3WarnVisible = ref<boolean>(false);
const mintTabsRef = ref<TabsInst | null>(null);
const collectionCreated = ref<boolean>(false);

let collectionInterval: any = null as any;

onMounted(() => {
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
});

async function onModalW3WarnConfirm() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }

  if (collectionStore.mintTab === NftMintTab.PREVIEW) {
    /* collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;
    await deployCollection(); */
    collectionStore.mintTab = NftMintTab.MINT;

    modalW3WarnVisible.value = false;
  } else {
    modalW3WarnVisible.value = false;
  }
}

async function deployCollection() {
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
    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYING;

    collectionStore.resetMetadata();
    collectionStore.resetForms();
    bucketStore.resetData();

    /** Deployment status */
    checkUnfinishedCollections();
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;

    collectionStore.mintTab = NftMintTab.MINT;
  } catch (error) {
    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;

    message.error(userFriendlyMsg(error));
  }
}
function checkUnfinishedCollections() {
  const unfinishedCollection = collectionStore.items.find(
    collection =>
      collection.collectionStatus === CollectionStatus.DEPLOY_INITIATED ||
      collection.collectionStatus === CollectionStatus.DEPLOYING
  );
  if (unfinishedCollection === undefined) {
    return;
  }

  clearInterval(collectionInterval);
  collectionInterval = setInterval(async () => {
    const collections = await collectionStore.fetchCollections(false);
    const collection = collections.find(
      collection => collection.collection_uuid === unfinishedCollection.collection_uuid
    );
    if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(collectionInterval);
    }
  }, 30000);
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
