<template>
  <Dashboard :loading="false">
    <template #heading>
      <Heading>
        <slot>
          <n-space align="center" :size="32">
            <NuxtLink
              v-if="collectionStore.metadataStored === null"
              :to="{ name: 'dashboard-service-nft' }"
            >
              <span class="icon-back text-base"></span>
            </NuxtLink>
            <button v-else @click="goToPreviousStep">
              <span class="icon-back text-base"></span>
            </button>
            <h4>{{ $t('nft.collection.new') }}</h4>
          </n-space>
        </slot>
        <template #info>
          <div class="card-light flex items-center h-10 px-4 py-2 rounded-lg">
            <span>{{ $t('general.smBy') }}</span>
            <NuxtIcon name="nft/moonbeam" class="icon-auto" filled />
          </div>
        </template>
      </Heading>
    </template>

    <slot>
      <div
        v-if="collectionCreated"
        class="flex justify-center items-center"
        style="min-height: calc(100vh - 270px)"
      >
        <div class="w-full max-w-lg text-center">
          <NuxtIcon
            name="nft/collectionCreated"
            class="flex justify-center icon-auto mb-4"
            filled
          />
          <h2>{{ $t('nft.collection.created.title') }}</h2>
          <p class="mb-8 text-body whitespace-pre-line">
            <span class="block">
              {{ $t('nft.collection.created.info', { name: collectionStore.active.name }) }}
            </span>
            <span class="inline-block mx-1">{{ $t('nft.collection.created.view') }}</span>
            <NuxtLink href="https://moonscan.io/" target="_blank">
              <Btn type="builders" size="tiny">
                {{ $t('nft.collection.created.explorer') }}
              </Btn>
            </NuxtLink>
            <span class="inline-block mx-1">{{ $t('nft.collection.created.or') }}</span>
            <NuxtLink
              :to="`/dashboard/service/storage/${collectionStore.bucketId}`"
              target="_blank"
            >
              <Btn type="builders" size="tiny">
                {{ $t('nft.collection.created.bucket') }}
              </Btn>
            </NuxtLink>
          </p>
          <NuxtLink :to="`/dashboard/service/nft/${collectionStore.active.id}`">
            <Btn>
              {{ $t('nft.collection.view') }}
            </Btn>
          </NuxtLink>
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
        <n-tab-pane :name="NftMintTab.UPLOAD" :disabled="!collectionStore.bucketId">
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

function goToPreviousStep() {
  if (collectionStore.mintTab === NftMintTab.MINT) {
    collectionStore.mintTab = NftMintTab.UPLOAD;
  } else if (collectionStore.mintTab === NftMintTab.UPLOAD) {
    collectionStore.mintTab = NftMintTab.METADATA;
  } else {
    collectionStore.metadataStored = null;
  }
}
</script>
