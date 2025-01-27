<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <n-input
        v-model:value="collectionStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Refresh collections -->
      <n-button size="small" :loading="collectionStore.loading" @click="collectionStore.fetchCollections(archive)">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <n-button
        v-if="collectionStore.hasCollections"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="createNewCollection()"
      >
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ t('nft.collection.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Collection Transfer -->
  <modal v-model:show="modalCreateCollectionVisible" class="hide-header max-w-4xl text-center">
    <FormNftCollectionMetadataType v-if="collectionStore.metadataStored === undefined" @submit="" />
    <FormNftCollectionNetworkSelect
      v-else-if="collectionStore.form.behavior.chain === undefined"
      @submit="onNetworkSelected"
    />
    <FormNftCollectionIpnsType v-else @submit="router.push({ name: 'dashboard-service-nft-new' })" />
  </modal>
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const { onNetworkSelected, resetAll } = useCollection();
const modalCreateCollectionVisible = ref<boolean>(false);

function createNewCollection() {
  modalCreateCollectionVisible.value = true;
  resetAll();
}
</script>
