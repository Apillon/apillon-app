<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderNftAdd />
      </div>
    </template>

    <slot>
      <NftMetadataWizard ref="metadataRef" />
      <ModalLeaving v-if="metadataStore.stepCollectionCreate < CollectionCreateStep.DEPLOYING" />
      <Btn @click="metadataRef?.nextStep()">Next</Btn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { CollectionCreateStep } from '~/lib/types/nft';

const { params } = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();
const metadataRef = useTemplateRef('metadataRef');

const headingRef = ref<HTMLElement>();
const pageLoading = ref<boolean>(true);
const collectionUuid = ref<string>(`${params?.slug}`);

onMounted(async () => {
  if (!params?.slug) router.push({ name: 'dashboard-service-nft' });

  const currentCollection = await collectionStore.getCollection(collectionUuid.value);

  if (!currentCollection?.collection_uuid) {
    router.push({ name: 'dashboard-service-nft' });
  } else {
    paymentStore.getPriceList();
    storageStore.getStorageInfo();

    pageLoading.value = false;
    collectionStore.active = currentCollection;
    metadataStore.form.single.collectionUuid = currentCollection.collection_uuid;
  }
});
</script>
