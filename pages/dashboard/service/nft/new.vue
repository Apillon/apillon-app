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
          <!-- METADATA -->
          <n-tab-pane :name="NftMintTab.METADATA">
            <template #tab>
              <IconNumber
                v-if="collectionStore.mintTab === NftMintTab.METADATA"
                :number="1"
                :active="true"
              />
              <IconSuccessful v-else />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.uploadMetadata') }}</span>
            </template>
            <slot>
              <!-- METADATA: storage type -->
              <div
                class="flex justify-center items-center"
                style="min-height: calc(100dvh - 300px)"
              >
                <div class="max-w-lg text-center pb-8">
                  <h2>{{ $t('nft.metadata.title') }}</h2>

                  <p class="text-body whitespace-pre-line mb-8">
                    {{ $t('nft.metadata.infoNew') }}
                  </p>

                  <Notification v-if="isFormDisabled" type="error" class="w-full mb-4">
                    {{ $t('dashboard.permissions.insufficient') }}
                  </Notification>
                  <div class="flex flex-col gap-4 px-2">
                    <Btn size="large" type="primary" :disabled="isFormDisabled" @click="goToWizard">
                      {{ $t('nft.metadata.yes') }}
                    </Btn>
                    <Btn size="large" type="secondary" :disabled="isFormDisabled" @click="goToForm">
                      <span class="inline-block -mx-1">{{ $t('nft.metadata.no') }}</span>
                    </Btn>
                  </div>
                </div>
              </div>
            </slot>
          </n-tab-pane>

          <!-- UPLOAD -->
          <n-tab-pane :name="NftMintTab.UPLOAD">
            <template #tab>
              <IconSuccessful v-if="collectionStore.mintTab === NftMintTab.MINT" />
              <IconNumber
                v-else
                :number="2"
                :active="collectionStore.mintTab === NftMintTab.UPLOAD"
              />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.uploadData') }}</span>
            </template>
            <slot>
              <FormNftUpload />
            </slot>
          </n-tab-pane>

          <!-- DEPLOY -->
          <n-tab-pane
            :name="NftMintTab.MINT"
            :disabled="
              !collectionStore.hasCsvFile ||
              !collectionStore.hasMetadata ||
              !collectionStore.hasImages
            "
          >
            <template #tab>
              <IconNumber :number="3" :active="collectionStore.mintTab === NftMintTab.MINT" />
              <span class="ml-2 text-sm text-white">{{ $t('nft.collection.mintNfts') }}</span>
            </template>
            <slot>
              <FormNftDeploy @submit-success="collectionCreated = true" />
            </slot>
          </n-tab-pane>
        </n-tabs>
        <!-- Button back -->
        <button
          v-if="collectionStore.metadataStored !== null"
          class="absolute left-0 top-[10px]"
          @click="goToPreviousStep"
        >
          <span class="icon-back text-2xl align-sub"></span>
        </button>

        <!-- Buttons switch preview-->
        <div
          v-if="
            collectionStore.mintTab === NftMintTab.UPLOAD &&
            collectionStore.stepUpload === NftUploadStep.PREVIEW
          "
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

      <W3Warn v-model:show="modalW3WarnVisible">
        {{ $t('w3Warn.nft.new') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import type { TabsInst } from 'naive-ui';

const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();
const { transactionLink } = useNft();
const { isFormDisabled } = useCollection();

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

const pageLoading = ref<boolean>(true);
const loadingBucket = ref<boolean>(false);
const modalW3WarnVisible = ref<boolean>(false);
const mintTabsRef = ref<TabsInst | null>(null);
const collectionCreated = ref<boolean>(false);

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

/** Watch active tab, if informations are missing, open previous tab */
watch(
  () => collectionStore.mintTab,
  tab => {
    if (tab === NftMintTab.MINT && (!collectionStore.hasCsvFile || !collectionStore.hasImages)) {
      collectionStore.mintTab = NftMintTab.IMAGES;
      nextTick(() => mintTabsRef.value?.syncBarPosition());
    } else if (tab === NftMintTab.IMAGES && !collectionStore.hasCsvFile) {
      collectionStore.mintTab = NftMintTab.METADATA;
      nextTick(() => mintTabsRef.value?.syncBarPosition());
    }
    if (tab === NftMintTab.METADATA) {
      collectionStore.stepUpload = NftUploadStep.FILE;
    } else if (tab === NftMintTab.UPLOAD) {
      collectionStore.stepDeploy = NftDeployStep.NAME;
    }
  }
);

function goToForm() {
  collectionStore.resetForms();
  collectionStore.metadataStored = true;
}

function goToWizard() {
  bucketStore.resetFolder();
  bucketStore.resetUpload();
  collectionStore.resetForms();
  collectionStore.metadataStored = false;
  collectionStore.mintTab = NftMintTab.UPLOAD;
}

function goToPreviousStep() {
  switch (collectionStore.mintTab) {
    case NftMintTab.MINT:
      if (collectionStore.stepDeploy > NftDeployStep.NAME) {
        collectionStore.stepDeploy -= 1;
      } else {
        collectionStore.mintTab = NftMintTab.UPLOAD;
      }
      return;
    case NftMintTab.UPLOAD:
      if (collectionStore.stepUpload > NftUploadStep.FILE) {
        collectionStore.stepUpload -= 1;
      } else {
        collectionStore.mintTab = NftMintTab.METADATA;
        collectionStore.metadataStored = null;
      }
      return;
    default:
      collectionStore.metadataStored = null;
  }
}

async function openBucket(bucketUuid: string) {
  if (!bucketUuid) {
    return;
  }
  loadingBucket.value = true;

  const bucket = await bucketStore.fetchBucket(bucketUuid);
  loadingBucket.value = false;

  if (bucket && bucket.bucket_uuid) {
    router.push(`/dashboard/service/storage/${bucket.bucket_uuid}`);
  }
}
</script>
