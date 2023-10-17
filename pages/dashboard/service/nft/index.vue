<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.nft') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo v-if="$i18n.te('w3Warn.nft.new')" @click="showModalW3Warn = true" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <TableNftCollection
        v-if="collectionStore.hasCollections"
        :collections="collectionStore.items"
      />
      <Empty
        v-else
        :title="$t('nft.collection.empty')"
        :info="$t('nft.collection.emptyInfo')"
        icon="nft/illustration"
      >
        <Btn type="primary" @click="router.push({ name: 'dashboard-service-nft-new' })">
          {{ $t('nft.collection.createFirst') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="showModalW3Warn" @submit="onModalW3WarnHide">
        {{ $t('w3Warn.nft.new') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const modalNewCollectionVisible = ref<boolean | null>(false);

let collectionInterval: any = null as any;

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await collectionStore.getCollections();

      setTimeout(() => {
        checkUnfinishedCollections();
      }, 3000);

      pageLoading.value = false;
    });
  }, 100);
});
onUnmounted(() => {
  clearInterval(collectionInterval);
});

/** When user close W3Warn, allow him to create new collection */
function onModalW3WarnHide() {
  if (modalNewCollectionVisible.value !== false) {
    modalNewCollectionVisible.value = true;
  }
}

/** Watch modalNewCollectionVisible, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      localStorage.setItem(LsW3WarnKeys.NFT_NEW, Date.now().toString());
    }
  }
);

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
    const collections = await collectionStore.fetchCollections(false);
    const collection = collections.find(collection => collection.id === unfinishedCollection.id);
    if (!collection) {
      clearInterval(collectionInterval);
    } else if (collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(collectionInterval);
    }
  }, 30000);
}
</script>
