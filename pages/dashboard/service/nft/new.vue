<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading>
        <slot>
          <n-space align="center" :size="32">
            <h4>{{ $t('nft.collection.new') }}</h4>
          </n-space>
        </slot>
        <template #info>
          <div
            class="flex items-center h-10 px-4 py-2 bg-bg-light border-1 border-bg-lighter rounded-lg"
          >
            <span>{{ $t('general.smBy') }}</span>
            <NuxtIcon name="nft/moonbeam" class="icon-auto" filled />
          </div>
        </template>
      </Heading>
    </template>

    <slot>
      <n-tabs
        ref="mintTabsRef"
        v-model:value="collectionStore.mintTab"
        type="bar"
        :bar-width="0"
        size="large"
        justify-content="space-evenly"
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
              v-if="collectionStore.metadataStored === null"
              class="flex justify-center items-center"
              style="height: calc(100vh - 300px)"
            >
              <div class="max-w-lg text-center">
                <h2>{{ $t('nft.metadata.title') }}</h2>
                <p class="text-body whitespace-pre-line">
                  {{ $t('nft.metadata.infoNew') }}
                </p>
                <div class="flex justify-center gap-4 px-2 mt-8">
                  <Btn
                    class="w-1/2"
                    type="secondary"
                    @click="collectionStore.metadataStored = true"
                  >
                    {{ $t('nft.metadata.yes') }}
                  </Btn>
                  <Btn
                    class="w-1/2"
                    type="secondary"
                    @click="collectionStore.metadataStored = false"
                  >
                    {{ $t('nft.metadata.no') }}
                  </Btn>
                </div>
              </div>
            </div>
            <!-- METADATA: create/select Bucket -->
            <FormNftBucket v-else-if="!collectionStore.metadataStored" />
          </slot>
        </n-tab-pane>
        <n-tab-pane
          :name="NftMintTab.IMAGES"
          :disabled="!collectionStore.hasCsvFile || !collectionStore.hasMetadata"
        >
          <template #tab>
            <IconSuccessful v-if="collectionStore.mintTab === NftMintTab.MINT" />
            <IconNumber
              v-else
              :number="2"
              :active="collectionStore.mintTab === NftMintTab.IMAGES"
            />
            <span class="ml-2">{{ $t('nft.collection.uploadImages') }}</span>
          </template>
          <slot>
            <FormNftUploadImages />
          </slot>
        </n-tab-pane>
        <n-tab-pane
          :name="NftMintTab.MINT"
          :disabled="
            !collectionStore.hasCsvFile ||
            !collectionStore.hasMetadata ||
            !collectionStore.hasImages ||
            !allImagesUploaded
          "
        >
          <template #tab>
            <IconNumber :number="3" :active="collectionStore.mintTab === NftMintTab.MINT" />
            <span class="ml-2">{{ $t('nft.collection.upload') }}</span>
          </template>
          <slot>
            <FormNftDeploy />
          </slot>
        </n-tab-pane>
      </n-tabs>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const $i18n = useI18n();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const { allImagesUploaded } = useNft();

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

const mintTabsRef = ref<NTabsInst | null>(null);

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
  }
);
</script>
