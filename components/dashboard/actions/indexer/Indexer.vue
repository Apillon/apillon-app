<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="indexerStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh -->
      <n-button size="small" :loading="indexerStore.loading" @click="indexerStore.fetchIndexers()">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new indexer -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="showModalNewIndexer = true">
        <span class="icon-file mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('indexer.new') }}</span>
      </n-button>
    </n-space>
  </n-space>
  <!-- Modal - Create Indexer -->
  <IndexerSpendingWarning v-model:show="showModalNewIndexer">
    <FormIndexer />
  </IndexerSpendingWarning>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const indexerStore = useIndexerStore();

const showModalNewIndexer = ref<boolean | null>(false);
</script>
