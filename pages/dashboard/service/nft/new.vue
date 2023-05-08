<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <div v-if="collectionCreated">
            <h1>{{ $t('nft.collection.display') }}</h1>
          </div>
          <n-space v-else align="center" :size="32">
            <NuxtLink
              v-if="collectionStore.metadataStored === null"
              :to="{ name: 'dashboard-service-nft' }"
            >
              <span class="icon-back text-base"></span>
            </NuxtLink>
            <button v-else @click="goToPreviousStep">
              <span class="icon-back text-base"></span>
            </button>
            <h1>{{ $t('nft.collection.new') }}</h1>
          </n-space>
        </slot>
        <template #info>
          <Badge icon="nft/moonbeam" />
        </template>
      </Heading>
    </template>

    <slot>
      <div v-if="collectionCreated">
        <p class="mb-2 text-body">
          <span class="inline-block mx-1">{{ $t('nft.collection.created.view') }}</span>
          <a
            :href="
              transactionLink(collectionStore.active.transactionHash, collectionStore.active.chain)
            "
            target="_blank"
          >
            <Btn type="builders" size="tiny">
              <span class="text-sm">{{ $t('nft.collection.created.explorer') }}</span>
            </Btn>
          </a>
          <span class="inline-block mx-1">{{ $t('nft.collection.created.or') }}</span>
          <a
            :to="`/dashboard/service/storage/${
              collectionStore.active.bucketId || collectionStore.active.bucket_uuid
            }`"
            target="_blank"
          >
            <Btn type="builders" size="tiny">
              <span class="text-sm">{{ $t('nft.collection.created.bucket') }}</span>
            </Btn>
          </a>
        </p>
        <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
          <div class="w-full max-w-lg text-center">
            <!-- <NuxtIcon
              name="nft/collectionCreated"
              class="flex justify-center icon-auto mb-4"
              filled
            /> -->
            <h2>{{ $t('nft.collection.created.title') }}</h2>
            <p class="mb-8 text-body whitespace-pre-line">
              {{ $t('nft.collection.created.info') }}
            </p>
            <a href="https://github.com/Apillon-web3/nft-template/fork" target="_blank">
              <Btn>
                {{ $t('nft.collection.createToDisplay') }}
              </Btn>
            </a>
            <div class="mt-2">
              <NuxtLink to="/dashboard/service/nft">
                <Btn type="builders" size="tiny">
                  <span class="text-sm">{{ $t('nft.collection.view') }} </span>
                </Btn>
              </NuxtLink>
            </div>
          </div>
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
      </div>
      <n-tabs
        v-else
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
            <div class="flex justify-center items-center" style="min-height: calc(100vh - 300px)">
              <div class="max-w-lg text-center pb-8">
                <h2>{{ $t('nft.metadata.title') }}</h2>

                <p class="text-body whitespace-pre-line mb-8">
                  {{ $t('nft.metadata.infoNew') }}
                </p>

                <!-- Notification - show if qouta has been reached -->
                <Notification v-if="isQuotaReached" type="warning" class="w-full mb-4">
                  {{ $t('nft.collection.quotaReached') }}
                </Notification>
                <Notification v-else-if="isFormDisabled" type="error" class="w-full mb-4">
                  {{ $t('dashboard.permissions.insufficient') }}
                </Notification>
                <div class="flex justify-center gap-4 px-2">
                  <Btn class="w-1/2" type="primary" :disabled="isFormDisabled" @click="goToWizzard">
                    {{ $t('nft.metadata.yes') }}
                  </Btn>
                  <Btn
                    class="w-1/2"
                    type="secondary"
                    :disabled="isFormDisabled"
                    @click="collectionStore.metadataStored = true"
                  >
                    <span class="inline-block -mx-1">{{ $t('nft.metadata.no') }}</span>
                  </Btn>
                </div>
              </div>
            </div>
          </slot>
        </n-tab-pane>
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
            <FormNftMintNft @submit-success="collectionCreated = true" />
          </slot>
        </n-tab-pane>
      </n-tabs>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const { transactionLink } = useNft();
const { isFormDisabled, isQuotaReached } = useCollection();

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

const pageLoading = ref<boolean>(true);
const mintTabsRef = ref<NTabsInst | null>(null);
const collectionCreated = ref<boolean>(false);

onMounted(() => {
  collectionStore.metadataStored = null;

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await collectionStore.getCollections();
      collectionStore.getCollectionQuota();

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

function goToWizzard() {
  collectionStore.metadataStored = false;
  collectionStore.mintTab = NftMintTab.UPLOAD;
}

function goToPreviousStep() {
  if (collectionStore.mintTab === NftMintTab.MINT) {
    collectionStore.mintTab = NftMintTab.UPLOAD;
  } else if (collectionStore.mintTab === NftMintTab.UPLOAD) {
    collectionStore.mintTab = NftMintTab.METADATA;
    collectionStore.metadataStored = null;
  } else {
    collectionStore.metadataStored = null;
  }
}
</script>
