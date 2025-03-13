<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderNftCollection />
      </div>
    </template>

    <slot>
      <div
        v-if="!isNetworkSelected && !metadataStore.metadataStored && !isIpnsTypeSelected && !isUnique"
        class="flex-cc pt-4"
        style="min-height: calc(70dvh - 50px)"
      >
        <Spinner v-if="collectionStore.loading" />
        <FormNftMetadataType v-else-if="metadataStore.metadataStored === undefined" />
        <FormNftCollectionNetworkSelect
          v-else-if="metadataStore.form.smartContract.chain === undefined"
          class="mb-8"
          @submit="onNetworkSelected"
        />
        <FormNftCollectionIpnsType v-else @submit="isIpnsTypeSelected = true" />
      </div>
      <div v-else-if="metadataStore.metadataStored">
        <FormNftCollection />
      </div>
      <div v-else-if="createUniqueMetadata">
        <NftMetadataCreate :style="isLg ? scrollStyle : {}" />
      </div>
      <div v-else class="relative">
        <FormInstructions :title="t('nft.collection.data')" :instructions="[t('nft.collection.instruction.data')]">
          <FormNftCollectionBase ref="formVisualRef" hide-submit />
        </FormInstructions>

        <FormInstructions
          :title="t('nft.collection.smartContract')"
          :instructions="[t('nft.collection.instruction.smartContract')]"
        >
          <template #headerExtra>
            <NuxtIcon
              v-if="metadataStore.form.smartContract.chain"
              :name="`logo/${chainIdToName(metadataStore.form.smartContract.chain)}`"
              class="icon-auto text-2xl"
              filled
            />
            <div v-else class="flex items-center gap-2 text-2xl">
              <NftChains :chains="enumKeys(EvmChainMainnet)" />
            </div>
          </template>
          <FormNftCollectionBehavior
            ref="formSmartContractRef"
            :show-network="!isNetworkSelected"
            :show-ipns="!isIpnsTypeSelected"
            hide-submit
          />
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

      <ModalLeaving
        v-if="collectionStore.stepCollectionDeploy < CollectionStatus.DEPLOYED && !metadataStore.metadataStored"
      />
      <ModalSuccess
        v-if="!isUnique && collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOYED"
        :title="$t('form.success.created.nftCollection')"
        :content="$t('nft.addNftsNow')"
        :btn1="$t('nft.addNfts')"
        :btn1-action="() => router.push(`/dashboard/service/nft/${collectionStore.active.collection_uuid}/add`)"
        :btn2="$t('nft.openCollection')"
        :btn2-action="() => router.push(`/dashboard/service/nft/${collectionStore.active.collection_uuid}`)"
      />

      <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnConfirm">
        {{ t('w3Warn.nft.collection') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { useMessage } from 'naive-ui';
import { enumKeys } from '~/lib/utils';
import { chainIdToName } from '~/lib/utils/chain';
import { CollectionStatus } from '~/lib/types/nft';

const { t, te } = useI18n();
const { isLg } = useScreen();
const router = useRouter();
const message = useMessage();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const warningStore = useWarningStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

const { getPriceServiceName, uploadLogoAndCover } = useMetadata();
const { collectionEndpoint, isFormDisabled, isUnique, onChainChange, prepareFormData } = useCollection();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const headingRef = ref<HTMLElement>();
const formVisualRef = useTemplateRef('formVisualRef');
const formSmartContractRef = useTemplateRef('formSmartContractRef');
const pageLoading = ref<boolean>(true);
const createUniqueMetadata = ref<boolean>(false);
const isNetworkSelected = ref<boolean>(metadataStore.metadataStored !== undefined);
const isIpnsTypeSelected = ref<boolean>(metadataStore.form.smartContract.useIpns !== undefined);

const scrollStyle = computed(() => {
  return {
    minHeight: `calc(100dvh - ${184 + (headingRef.value?.clientHeight || 73)}px)`,
  };
});

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await collectionStore.getCollections();
  storageStore.getStorageInfo();
  paymentStore.getPriceList();

  /** Check if user can create Ethereum collection */
  collectionStore.getQuota();

  pageLoading.value = false;
});

const onNetworkSelected = (chainId: number) => {
  metadataStore.form.smartContract.chain = chainId;
  onChainChange(chainId);
  isNetworkSelected.value = true;
};

const submitFormVisual = async () => (formVisualRef.value ? await formVisualRef.value.handleSubmitForm() : false);
const submitFormSmartContract = async () =>
  formSmartContractRef.value ? await formSmartContractRef.value.handleSubmitForm() : false;
const isLoading = computed(
  () => modalW3WarnVisible.value || collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOY_INITIATED
);

async function w3WarnAndDeploy() {
  const FormVisualSubmitted = await submitFormVisual();
  const FormSmartContractSubmitted = await submitFormSmartContract();

  if (FormVisualSubmitted && FormSmartContractSubmitted) {
    if (!localStorage.getItem(LsW3WarnKeys.NFT_NEW) && te('w3Warn.nft.new')) {
      modalW3WarnVisible.value = true;
    } else {
      onModalW3WarnConfirm();
    }
  }
}

async function onModalW3WarnConfirm() {
  if (isUnique.value) {
    createUniqueMetadata.value = true;
  } else {
    warningStore.showSpendingWarning(getPriceServiceName(), () => createCollection());
  }
}
async function createCollection() {
  collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOY_INITIATED;
  modalW3WarnVisible.value = false;

  try {
    const { data } = await $api.post<CollectionResponse>(collectionEndpoint(), prepareFormData());
    collectionStore.active = data;

    /** On new collection created add new collection to list */
    collectionStore.items.push(data);
    metadataStore.form.single.collectionUuid = data.collection_uuid;

    /** Uploads logo and cover image */
    uploadLogoAndCover(data.bucket_uuid);

    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.DEPLOYED;
  } catch (e) {
    console.error(e);
    /** Deployment status */
    collectionStore.stepCollectionDeploy = CollectionStatus.FAILED;

    message.error(userFriendlyMsg(e));
  }
}
</script>
