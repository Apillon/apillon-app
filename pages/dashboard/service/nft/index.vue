<template>
  <ServiceEmpty
    v-if="!dataStore.project.selected"
    :name="ServiceTypeName.NFT.toLowerCase()"
    :service="ServiceTypeName.NFT"
    docs="https://wiki.apillon.io/web3-services/4-nfts.html"
    video-id="qQJnuvUo-xo"
    :videoChapters="[
      { time: '00:00', title: 'Intro' },
      { time: '00:35', title: 'Dashboard' },
      { time: '02:53', title: 'NFT Collection' },
      { time: '05:20', title: 'Minting' },
      { time: '07:15', title: 'Website' },
    ]"
  >
    <template #actions>
      <Btn @click="modalCreateCollectionVisible = true">{{ $t('dashboard.startBuilding') }}</Btn>
    </template>
  </ServiceEmpty>
  <Dashboard v-else :loading="pageLoading">
    <template #heading>
      <HeaderNft />
    </template>
    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsNftCollection />
        <TableNftCollection :collections="collectionStore.items" />
      </n-space>
    </slot>
  </Dashboard>

  <!-- Modal - Collection Transfer -->
  <ModalFullScreen v-model:show="modalCreateCollectionVisible" :progress="15" :title="$t('nft.collection.create')">
    <template #header-center>
      <div class="flex items-center gap-4 text-xs">
        <template v-for="(step, key) in enumValues(CollectionCreateStep)">
          <span v-if="key > 0 && $te(`nft.collection.createStep.${step}`)" class="card-border w-3"></span>
          <strong
            v-if="$te(`nft.collection.createStep.${step}`)"
            :class="{ 'text-yellow': step === collectionStore.stepCollectionCreate }"
          >
            {{ $t(`nft.collection.createStep.${step}`) }}
          </strong>
        </template>
      </div>
    </template>

    <slot>
      <div class="mx-auto max-w-lg">
        <NftMetadataWizard />
      </div>
    </slot>
    <template #footer>
      <div class="flex w-full items-center justify-between gap-4 px-10 py-3">
        <p>
          <strong>Total costs: </strong>
          <span>1 credits</span>
        </p>
        <Btn size="small" @click="collectionStore.stepCollectionCreate += 1">Continue</Btn>
      </div>
    </template>
  </ModalFullScreen>
</template>

<script lang="ts" setup>
import { enumValues } from '~/lib/utils';
import { CollectionCreateStep } from '~/lib/types/nft';
import { ServiceTypeName } from '~/lib/types/service';

const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const storageStore = useStorageStore();
const collectionStore = useCollectionStore();
const { onNetworkSelected, resetAll } = useCollection();

const pageLoading = ref<boolean>(true);
const modalCreateCollectionVisible = ref<boolean>(false);

let collectionInterval: any = null as any;

useHead({
  title: t('dashboard.nav.nft'),
});

onMounted(async () => {
  resetAll();
  await dataStore.waitOnPromises();
  await collectionStore.getCollections();

  storageStore.getStorageInfo();
  paymentStore.getPriceList();

  setTimeout(() => {
    checkUnfinishedCollections();
  }, 3000);

  pageLoading.value = false;
});
onUnmounted(() => {
  clearInterval(collectionInterval);
});

/** Collection polling */
function checkUnfinishedCollections() {
  const unfinishedCollection = collectionStore.items.find(
    collection =>
      collection.collectionStatus === CollectionStatus.DEPLOY_INITIATED ||
      collection.collectionStatus === CollectionStatus.DEPLOYING
  );
  if (unfinishedCollection === undefined) {
    return;
  }

  clearInterval(collectionInterval);
  collectionInterval = setInterval(async () => {
    const collections = await collectionStore.fetchCollections(false, false);
    const collection = collections.find(
      collection => collection.collection_uuid === unfinishedCollection.collection_uuid
    );
    if (!collection || collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(collectionInterval);
    }
  }, 30000);
}
</script>
