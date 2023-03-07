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
          <span class="icon-search text-2xl"></span>
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
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <n-button
        v-if="collectionStore.hasCollections"
        size="small"
        @click="modalNewCollectionVisible = true"
      >
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('nft.collection.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - New collection -->
  <modal v-model:show="modalNewCollectionVisible" :title="$t('nft.collection.new')">
    <FormNftCollection @submit-success="modalNewCollectionVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
const modalNewCollectionVisible = ref<boolean>(false);
</script>
