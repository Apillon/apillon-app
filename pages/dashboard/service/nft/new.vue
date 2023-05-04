<template>
  <Dashboard :loading="false">
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
          <NuxtLink href="https://moonscan.io/" target="_blank">
            <Btn type="builders" size="tiny">
              <span class="text-sm">{{ $t('nft.collection.created.explorer') }}</span>
            </Btn>
          </NuxtLink>
          <span class="inline-block mx-1">{{ $t('nft.collection.created.or') }}</span>
          <NuxtLink :to="`/dashboard/service/storage/${collectionStore.bucketId}`" target="_blank">
            <Btn type="builders" size="tiny">
              <span class="text-sm">{{ $t('nft.collection.created.bucket') }}</span>
            </Btn>
          </NuxtLink>
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
            <NuxtLink href="https://github.com/Apillon-web3/nft-template">
              <Btn>
                {{ $t('nft.collection.createToDisplay') }}
              </Btn>
            </NuxtLink>
            <div class="mt-2">
              <NuxtLink :to="`/dashboard/service/nft/${collectionStore.active.id}`">
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
            <div class="flex justify-center items-center" style="height: calc(100vh - 300px)">
              <div class="max-w-lg text-center">
                <h2>{{ $t('nft.metadata.title') }}</h2>
                <p class="text-body whitespace-pre-line">
                  {{ $t('nft.metadata.infoNew') }}
                </p>
                <div class="flex justify-center gap-4 px-2 mt-8">
                  <Btn class="w-1/2" type="primary" @click="goToWizzard">
                    {{ $t('nft.metadata.yes') }}
                  </Btn>
                  <Btn
                    class="w-1/2"
                    type="secondary"
                    @click="collectionStore.metadataStored = true"
                  >
                    {{ $t('nft.metadata.no') }}
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
const collectionStore = useCollectionStore();

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

const mintTabsRef = ref<NTabsInst | null>(null);
const collectionCreated = ref<boolean>(false);

onBeforeMount(() => {
  collectionStore.metadataStored = null;
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
