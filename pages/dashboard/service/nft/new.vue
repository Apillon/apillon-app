<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderNftNew />
      </div>
    </template>

    <slot>
      <div v-if="!isNetworkSelected" class="flex-cc pt-4" style="min-height: calc(70dvh - 50px)">
        <FormNftCollectionMetadataType v-if="collectionStore.metadataStored === null" />
        <FormNftCollectionNetworkSelect v-else class="mb-8" @submit="isNetworkSelected = true" />
      </div>
      <div v-else-if="collectionStore.metadataStored">
        <FormNftCollection />
      </div>
      <div v-else class="relative">
        <FormInstructions :title="t('nft.collection.data')" :instructions="[t('nft.collection.instruction.data')]">
          <FormNftCollectionBase ref="formBaseRef" hide-submit />
        </FormInstructions>

        <FormInstructions
          :title="t('nft.collection.smartContract')"
          :instructions="[t('nft.collection.instruction.smartContract')]"
        >
          <template #headerExtra>
            <div class="flex items-center gap-4 text-2xl">
              <NuxtIcon name="logo/moonbeam" class="icon-auto" filled />
              <NuxtIcon name="logo/astar" class="icon-auto" filled />
            </div>
          </template>
          <FormNftCollectionBehavior ref="formBehaviorRef" :show-network="!isNetworkSelected" hide-submit />
        </FormInstructions>

        <FormInstructions class="mb-8 !p-0">
          <Btn type="primary" size="large" :loading="isLoading" :disabled="isFormDisabled" @click="w3WarnAndDeploy">
            {{ t('nft.collection.create') }}
          </Btn>
        </FormInstructions>

        <Modal v-if="collectionStore.stepCollectionDeploy !== CollectionStatus.DEPLOY_INITIATED">
          <AnimationDeploy />
        </Modal>
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
import { CollectionStatus } from '~/lib/types/nft';

const { t, te } = useI18n();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { uploadFiles } = useUpload();
const { getPriceServiceName } = useNft();
const { isFormDisabled, collectionEndpoint, prepareFormData, prepareLogoAndCover } = useCollection();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const headingRef = ref<HTMLElement>();
const formBaseRef = useTemplateRef('formBaseRef');
const formBehaviorRef = useTemplateRef('formBehaviorRef');
const pageLoading = ref<boolean>(true);
const isNetworkSelected = ref<boolean>(collectionStore.metadataStored !== null);

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  await sleep(200);
  await Promise.all(Object.values(dataStore.promises)).then(async _ => {
    storageStore.getStorageInfo();
    await collectionStore.getCollections();

    pageLoading.value = false;
  });

  /** Get Price list */
  await paymentStore.getPriceList();
});

const submitFormBase = async () => (formBaseRef.value ? await formBaseRef.value.handleSubmitForm() : false);
const submitFormBehavior = async () => (formBehaviorRef.value ? await formBehaviorRef.value.handleSubmitForm() : false);
const isLoading = computed(() => collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOY_INITIATED);

async function w3WarnAndDeploy() {
  const formBaseSubmitted = await submitFormBase();
  const formBehaviorSubmitted = await submitFormBehavior();

  if (formBaseSubmitted && formBehaviorSubmitted) {
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
    if (images.length > 0) {
      await uploadFiles(res.data.bucket_uuid, images);
    }

    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;

    router.push(`/dashboard/service/nft/${res.data.collection_uuid}/add`);
  } catch (error) {
    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;

    message.error(userFriendlyMsg(error));
  }
}
</script>
