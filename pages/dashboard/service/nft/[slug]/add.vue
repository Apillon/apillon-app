<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderNftAdd />
      </div>
    </template>

    <slot>
      <NftMetadataCreate :style="isLg ? scrollStyle : {}" />
      <ModalLeaving v-if="collectionStore.stepCollectionDeploy < CollectionStatus.DEPLOYED" />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { CollectionStatus } from '~/lib/types/nft';

const { isLg } = useScreen();
const { params } = useRoute();
const router = useRouter();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();

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

  const currentCollection = await collectionStore.getCollection(collectionUuid.value);

  if (!currentCollection?.collection_uuid) {
    router.push({ name: 'dashboard-service-nft' });
  } else {
    collectionStore.stepCollectionDeploy = CollectionStatus.CREATED;

    paymentStore.getPriceList();
    storageStore.getStorageInfo();

    pageLoading.value = false;
    collectionStore.active = currentCollection;
    metadataStore.form.single.collectionUuid = currentCollection.collection_uuid;
  }
});
</script>
