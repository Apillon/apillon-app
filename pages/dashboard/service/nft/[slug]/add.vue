<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderNftNew />
      </div>
    </template>

    <slot>
      <div
        class="relative w-full"
        :class="{ 'flex-cc': collectionStore.nftStep !== NftCreateStep.PREVIEW }"
        :style="isLg ? scrollStyle : {}"
      >
        <FormNftAmountOption v-if="collectionStore.nftStep === NftCreateStep.AMOUNT" />
        <FormNftUpload v-else-if="collectionStore.nftStep === NftCreateStep.MULTIPLE" />
        <FormNftUploadSingle v-else-if="collectionStore.nftStep === NftCreateStep.SINGLE" />

        <!-- Preview -->
        <div v-else-if="collectionStore.nftStep === NftCreateStep.PREVIEW" class="pt-8">
          <NftPreview>
            <Btn class="w-60" type="primary" @click="w3WarnAndDeploy()">
              {{ t('nft.deploy.single') }}
            </Btn>
          </NftPreview>
        </div>
        <NftPreviewFinish
          v-else-if="
            collectionStore.nftStep === NftCreateStep.DEPLOY &&
            collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOYED
          "
          show-footer
        />
        <div v-else-if="collectionStore.nftStep === NftCreateStep.DEPLOY" class="w-full pb-8">
          <AnimationDeploy />
        </div>

        <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
          {{ t('w3Warn.nft.new') }}
        </W3Warn>
      </div>

      <!-- Buttons switch preview-->
      <div v-if="collectionStore.nftStep === NftCreateStep.PREVIEW" class="absolute right-4 top-4 flex items-center">
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
      </div>
      <W3Warn v-model:show="modalW3WarnVisible" @submit="modalW3WarnVisible = false">
        {{ t('w3Warn.nft.collection') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { CollectionStatus, NftCreateStep } from '~/lib/types/nft';

const router = useRouter();
const message = useMessage();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();

const { t, te } = useI18n();
const { isLg } = useScreen();
const { params } = useRoute();
const { deployCollection } = useNft();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const pageLoading = ref<boolean>(true);

/** Collection UUID from route */
const collectionUuid = ref<string>(`${params?.slug}`);

const headingRef = ref<HTMLElement>();
const scrollStyle = computed(() => {
  return {
    minHeight: `calc(100dvh - ${184 + (headingRef.value?.clientHeight || 73)}px)`,
  };
});

onMounted(async () => {
  if (!params?.slug) router.push({ name: 'dashboard-service-nft' });

  /** Get Price list */
  paymentStore.getPriceList();

  const currentCollection = await collectionStore.getCollection(collectionUuid.value);

  if (!currentCollection?.collection_uuid) {
    router.push({ name: 'dashboard-service-nft' });
  } else {
    collectionStore.resetFile();
    collectionStore.resetImages();
    collectionStore.stepCollectionDeploy = CollectionStatus.CREATED;

    await storageStore.getStorageInfo();

    pageLoading.value = false;
    collectionStore.active = currentCollection;
    collectionStore.form.single.collectionUuid = currentCollection.collection_uuid;
  }
});

const metadataValid = () => !collectionStore.metadata.some(item => !item.image || !item.name || !item.description);

function w3WarnAndDeploy() {
  if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new') && t('w3Warn.nft.new')) {
    modalW3WarnVisible.value = true;
  } else {
    onModalW3WarnConfirm();
  }
}

async function onModalW3WarnConfirm() {
  if (!metadataValid()) {
    message.warning(t('validation.nftMetadata'));
  } else {
    deploy();
  }
}

async function deploy() {
  modalW3WarnVisible.value = false;
  collectionStore.nftStep = NftCreateStep.DEPLOY;
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;

  try {
    await deployCollection(collectionStore.active.collectionStatus === CollectionStatus.CREATED);

    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;
    collectionStore.resetCache();
  } catch (error) {
    /** Deployment status */
    collectionStore.nftStep = NftCreateStep.PREVIEW;
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;

    message.error(userFriendlyMsg(error));
  }
}
</script>
