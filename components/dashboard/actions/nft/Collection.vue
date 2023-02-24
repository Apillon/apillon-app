<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="collectionStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Refresh collections -->
      <n-button
        size="small"
        :loading="collectionStore.loading"
        @click="collectionStore.fetchCollections()"
      >
        <span class="icon-refresh text-lg mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <n-button
        v-if="collectionStore.hasCollections"
        type="primary"
        size="small"
        ghost
        @click="modalEditCollectionVisible = true"
      >
        <span class="icon-create-folder text-xl mr-2"></span>
        {{ $t('nft.collection.new') }}
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - New collection -->
  <modal v-model:show="modalEditCollectionVisible" :title="$t('nft.collection.new')">
    <FormNftCollection />
  </modal>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
const modalEditCollectionVisible = ref<boolean>(false);
</script>
