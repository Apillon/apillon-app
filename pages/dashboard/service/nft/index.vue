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
      <TableHosting v-if="collectionStore.hasCollections" :collections="collectionStore.items" />
      <template v-else>
        <div
          class="flex flex-col items-center justify-center px-6 py-4"
          style="min-height: calc(100vh - 270px)"
        >
          <div class="mb-4">
            <NuxtIcon name="nft/illustration" class="icon-auto" filled />
          </div>
          <div class="mb-10 text-center">
            <h3 class="font-bold">{{ $t('nft.collectionsEmpty') }}</h3>
            <p class="text-body">{{ $t('nft.collectionsCreate') }}</p>
          </div>
          <div>
            <Btn type="primary" @click="createNewCollection">
              {{ $t('nft.collection.new') }}
            </Btn>
          </div>
        </div>
      </template>

      <W3Warn v-model:show="showModalW3Warn" @update:show="onModalW3WarnHide">
        {{ $t('w3Warn.nft.new') }}
      </W3Warn>

      <!-- Modal - Create Collection -->
      <modal v-model:show="showModalNewCollection" :title="$t('nft.collection.addNew')">
        <FormNftCollection />
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
const showModalNewCollection = ref<boolean | null>(false);

useHead({
  title: $i18n.t('nav.nft'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await collectionStore.getCollections();
      getCollectionQuota();

      pageLoading.value = false;
    });
  }, 100);
});

/** GET Collection quota, if current value is null  */
async function getCollectionQuota() {
  if (collectionStore.quotaReached === undefined) {
    await collectionStore.fetchCollectionQuota();
  }
}

/**
 * On createNewCollection click
 * If W3Warn has already been shown, show modal create new collection, otherwise show warn first
 * */
function createNewCollection() {
  if (sessionStorage.getItem(LsW3WarnKeys.HOSTING_NEW) || !$i18n.te('w3Warn.nft.new')) {
    showModalNewCollection.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalNewCollection.value = null;
  }
}

/** When user close W3Warn, allow him to create new collection */
function onModalW3WarnHide(value: boolean) {
  if (!value && showModalNewCollection.value !== false) {
    showModalNewCollection.value = true;
  }
}

/** Watch showModalNewCollection, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.HOSTING_NEW, Date.now().toString());
    }
  }
);
</script>
