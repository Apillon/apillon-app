<template>
  <!-- Buttons switch preview-->
  <div class="flex items-center">
    <span class="mr-2">{{ $t('general.view') }}:</span>
    <n-button
      class="w-10 px-0"
      :class="{ '!bg-bg-lighter': !collectionStore.gridView }"
      size="small"
      type="tertiary"
      quaternary
      round
      @click="collectionStore.gridView = false"
    >
      <span class="icon-list-view align-sub text-2xl"></span>
    </n-button>
    <n-button
      class="w-10 px-0"
      :class="{ '!bg-bg-lighter': collectionStore.gridView }"
      size="small"
      type="tertiary"
      quaternary
      round
      @click="collectionStore.gridView = true"
    >
      <span class="icon-grid-view align-sub text-2xl"></span>
    </n-button>
  </div>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
</script>
