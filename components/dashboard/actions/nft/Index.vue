<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-if="archive" v-model:value="collectionStore.archive.search" />
      <FormFieldSearch v-else v-model:value="collectionStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh collections -->
      <n-button
        :loading="archive ? collectionStore.archive.loading : collectionStore.loading"
        @click="collectionStore.fetchCollections(archive)"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <Btn
        v-if="collectionStore.hasCollections"
        inner-class="flex gap-2 items-center"
        type="primary"
        :disabled="authStore.isAdmin()"
        @click="openModalCreateCollection()"
      >
        <span class="icon-add text-xl"></span>
        <span> {{ $t('nft.collection.new') }} </span>
      </Btn>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

function openModalCreateCollection() {
  collectionStore.modalCreateVisible = true;
  metadataStore.resetForms();
}
</script>
