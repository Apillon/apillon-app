<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="flex"></div>

    <n-space size="large">
      <!-- Refresh -->
      <n-button
        size="small"
        :loading="indexerDeploymentsStore.loading"
        @click="indexerDeploymentsStore.fetchDeployments(indexerStore.active.indexer_uuid)"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const indexerStore = useIndexerStore();
const indexerDeploymentsStore = useIndexerDeploymentsStore();
</script>
