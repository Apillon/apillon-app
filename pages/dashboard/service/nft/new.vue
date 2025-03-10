<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderNftCollection />
      </div>
    </template>

    <slot>
      <div
        v-if="!isNetworkSelected && !collectionStore.metadataStored && !isIpnsTypeSelected && !isUnique"
        class="flex-cc pt-4"
        style="min-height: calc(70dvh - 50px)"
      >
        <Spinner v-if="collectionStore.loading" />
        <FormNftMetadataType v-else-if="collectionStore.metadataStored === undefined" />
        <FormNftCollectionNetworkSelect
          v-else-if="collectionStore.form.behavior.chain === undefined"
          class="mb-8"
          @submit="onNetworkSelected"
        />
        <FormNftCollectionIpnsType v-else @submit="isIpnsTypeSelected = true" />
      </div>
      <div v-else-if="collectionStore.metadataStored">
        <FormNftCollection />
      </div>
      <div v-else-if="createUniqueMetadata">
        <NftMetadataCreate :style="isLg ? scrollStyle : {}" />
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
            <NuxtIcon
              v-if="collectionStore.form.behavior.chain"
              :name="`logo/${chainIdToName(collectionStore.form.behavior.chain)}`"
              class="icon-auto text-2xl"
              filled
            />
            <div v-else class="flex items-center gap-2 text-2xl">
              <NftChains :chains="enumKeys(EvmChainMainnet)" />
            </div>
          </template>
          <FormNftCollectionBehavior
            ref="formBehaviorRef"
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
        v-if="collectionStore.stepCollectionDeploy < CollectionStatus.DEPLOYED && !collectionStore.metadataStored"
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
const collectionStore = useCollectionStore();

const { getPriceServiceName, uploadLogoAndCover } = useNft();
const { collectionEndpoint, isFormDisabled, isUnique, onChainChange, prepareFormData } = useCollection();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.NFT_NEW);

const headingRef = ref<HTMLElement>();
const formBaseRef = useTemplateRef('formBaseRef');
const formBehaviorRef = useTemplateRef('formBehaviorRef');
const pageLoading = ref<boolean>(true);
const createUniqueMetadata = ref<boolean>(false);
const isNetworkSelected = ref<boolean>(collectionStore.metadataStored !== undefined);
const isIpnsTypeSelected = ref<boolean>(collectionStore.form.behavior.useIpns !== undefined);

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
  collectionStore.form.behavior.chain = chainId;
  onChainChange(chainId);
  isNetworkSelected.value = true;
};

const submitFormBase = async () => (formBaseRef.value ? await formBaseRef.value.handleSubmitForm() : false);
const submitFormBehavior = async () => (formBehaviorRef.value ? await formBehaviorRef.value.handleSubmitForm() : false);
const isLoading = computed(
  () => modalW3WarnVisible.value || collectionStore.stepCollectionDeploy === CollectionStatus.DEPLOY_INITIATED
);

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
    collectionStore.form.single.collectionUuid = data.collection_uuid;

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
