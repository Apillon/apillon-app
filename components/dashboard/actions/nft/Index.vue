<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-if="archive" v-model:value="collectionStore.archive.search" />
      <FormFieldSearch v-else v-model:value="collectionStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh collections -->
      <n-button
        size="small"
        :loading="archive ? collectionStore.archive.loading : collectionStore.loading"
        @click="collectionStore.fetchCollections(archive)"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <n-button
        v-if="collectionStore.hasCollections"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="modalCreateCollectionVisible = true"
      >
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('nft.collection.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <ModalNft v-model:show="modalCreateCollectionVisible" />
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const modalCreateCollectionVisible = ref<boolean>(false);
</script>
