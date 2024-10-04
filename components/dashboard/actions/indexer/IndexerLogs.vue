<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="indexerLogStore.search"
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
      <!-- Refresh -->
      <n-button
        size="small"
        :loading="indexerLogStore.loading"
        @click="
          indexerLogStore.fetchLogs(
            indexerStore.active.indexer_uuid,
            indexerLogStore.pagination.page,
            indexerStore.pagination.pageSize
          )
        "
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const indexerStore = useIndexerStore();
const indexerLogStore = useIndexerLogStore();
</script>
