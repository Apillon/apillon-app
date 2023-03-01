<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('nav.nft') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <button
              v-if="$i18n.te('w3Warn.nft.new')"
              class="align-sub"
              @click="showModalW3Warn = true"
            >
              <span class="icon-info text-xl"></span>
            </button>
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
        :title="$t('nft.collectionsEmpty')"
        :info="$t('nft.collectionsCreate')"
        icon="nft/illustration"
      >
        <Btn type="primary" @click="createNewCollection">
          {{ $t('nft.collection.new') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="showModalW3Warn" @update:show="onModalW3WarnHide">
        {{ $t('w3Warn.nft.new') }}
      </W3Warn>

      <!-- Modal - Create Collection -->
      <modal v-model:show="modalNewCollectionVisible" :title="$t('nft.collection.addNew')">
        <FormNftCollection @submit-success="onCollectionCreated" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const modalNewCollectionVisible = ref<boolean | null>(false);
let collectionInterval: any = null as any;

useHead({
  title: $i18n.t('nav.nft'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await collectionStore.getCollections();
      checkUnfinishedCollections();

      pageLoading.value = false;
    });
  }, 100);
});
onUnmounted(() => {
  clearInterval(collectionInterval);
});

/**
 * On createNewCollection click
 * If W3Warn has already been shown, show modal create new collection, otherwise show warn first
 * */
function createNewCollection() {
  if (sessionStorage.getItem(LsW3WarnKeys.HOSTING_NEW) || !$i18n.te('w3Warn.nft.new')) {
    modalNewCollectionVisible.value = true;
  } else {
    showModalW3Warn.value = true;
    modalNewCollectionVisible.value = null;
  }
}

/** When user close W3Warn, allow him to create new collection */
function onModalW3WarnHide(value: boolean) {
  if (!value && modalNewCollectionVisible.value !== false) {
    modalNewCollectionVisible.value = true;
  }
}

/** Watch modalNewCollectionVisible, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.HOSTING_NEW, Date.now().toString());
    }
  }
);

function onCollectionCreated() {
  modalNewCollectionVisible.value = false;
  setTimeout(() => {
    checkUnfinishedCollections();
  }, 3000);
}

/** Collection pooling */
function checkUnfinishedCollections() {
  const unfinishedCollection = collectionStore.items.find(
    collection => collection.collectionStatus < CollectionStatus.DEPLOYED
  );
  if (unfinishedCollection === undefined) {
    return;
  }

  collectionInterval = setInterval(async () => {
    const collections = await collectionStore.fetchCollections(false);
    const collection = collections.find(collection => collection.id === unfinishedCollection.id);
    if (!collection) {
      clearInterval(collectionInterval);
      return;
    } else if (collection.collectionStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(collectionInterval);
    }
  }, 30000);
}
</script>