<template>
  <Dashboard :loading="pageLoading" full-height>
    <template #heading>
      <div ref="headingRef">
        <HeaderNftAdd />
      </div>
    </template>

    <slot>
      <AnimationDeploy v-if="metadataStore.stepMetadata === NftMetadataStep.DEPLOYING" class="my-12 lg:mt-24" />
      <NftCollectionDeployed
        v-else-if="metadataStore.stepMetadata === NftMetadataStep.DEPLOYED"
        class="mx-auto max-w-5xl pb-8"
      />
      <NftMetadataWizard v-else ref="metadataRef" class="pb-8" />
      <ModalLeaving v-if="metadataStore.stepMetadata < NftMetadataStep.DEPLOYING" />
    </slot>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-4 bg-bg-light px-10 py-3">
        <p>
          <strong>{{ $t('nft.collection.review.totalCosts') }}: </strong>
          <span>{{ totalCredits }} {{ $t('dashboard.credits.credits') }}</span>
        </p>
        <div class="flex items-center gap-2">
          <Btn
            v-if="metadataStore.stepMetadata > NftMetadataStep.NEW"
            class="min-w-40"
            type="secondary"
            @click="metadataRef?.back()"
          >
            {{ $t('general.back') }}
          </Btn>
          <Btn
            v-if="[NftMetadataStep.SINGLE_PREVIEW, NftMetadataStep.CSV_PREVIEW].includes(metadataStore.stepMetadata)"
            class="min-w-40"
            @click="deployMetadata"
          >
            {{ $t('nft.upload.deploy') }}
          </Btn>
          <Btn v-else class="min-w-40" @click="metadataRef?.nextStep()">
            <template v-if="metadataStore.stepMetadata === NftMetadataStep.SINGLE">
              {{ $t('nft.add') }}
            </template>
            <template v-else>{{ $t('form.continue') }}</template>
          </Btn>
        </div>
      </div>
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';

const router = useRouter();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

const { error } = useMessage();
const { params } = useRoute();
const { pricing, deployCollection } = useMetadata();
const metadataRef = useTemplateRef('metadataRef');

const headingRef = ref<HTMLElement>();
const pageLoading = ref<boolean>(true);
const collectionUuid = ref<string>(`${params?.slug}`);

const totalCredits = computed(() => sumCredits(pricing.value));

onBeforeMount(() => {
  metadataStore.stepMetadata = NftMetadataStep.NEW;
});
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
    metadataStore.form.smartContract.chain = currentCollection.chain;
  }
});

async function deployMetadata() {
  metadataStore.stepMetadata = NftMetadataStep.DEPLOYING;
  try {
    await deployCollection(collectionStore.active);
    metadataStore.stepMetadata = NftMetadataStep.DEPLOYED;
  } catch (e) {
    error(userFriendlyMsg(e));
    metadataStore.stepMetadata = NftMetadataStep.JSON_PREVIEW;
  }
}
</script>
