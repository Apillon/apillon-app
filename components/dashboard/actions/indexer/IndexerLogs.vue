<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="flex">
      <n-input
        v-model:value="indexerLogStore.search"
        class="min-w-[11rem] w-[20vw] max-w-xs"
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

      <!-- <n-date-picker
        v-model:value="indexerLogStore.filter.dateFrom"
        class="max-w-xs ml-2"
        type="datetime"
        size="small"
        clearable
      /> -->

      <!-- Filter log level -->
      <select-options
        v-model:value="indexerLogStore.filter.logLevels"
        :options="logLevels"
        :placeholder="$t('form.placeholder.indexer.logLevels')"
        size="small"
        class="ml-2 min-w-[11rem] w-[20vw] max-w-xs"
        filterable
        clearable
        multiple
        @update:value="fetchLogsDebounced"
      />
      <!--Filter containers -->
      <select-options
        v-model:value="indexerLogStore.filter.containers"
        :options="containers"
        :placeholder="$t('form.placeholder.indexer.containers')"
        size="small"
        class="ml-2 min-w-[11rem] w-[20vw] max-w-xs"
        filterable
        clearable
        multiple
        @update:value="fetchLogsDebounced"
      />
    </div>

    <n-space size="large">
      <!-- Refresh -->
      <n-button
        size="small"
        :loading="indexerLogStore.loading"
        @click="indexerLogStore.fetchLogs(indexerStore.active.indexer_uuid)"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const { t } = useI18n();
const indexerStore = useIndexerStore();
const indexerLogStore = useIndexerLogStore();

/** Log levels */
const logLevels = ref<SelectOption[]>([
  {
    value: 'ERROR',
    label: t(`indexer.logLevels.error`),
  },
  {
    value: 'DEBUG',
    label: t(`indexer.logLevels.debug`),
  },
  {
    value: 'INFO',
    label: t(`indexer.logLevels.info`),
  },
  {
    value: 'NOTICE',
    label: t(`indexer.logLevels.notice`),
  },
  {
    value: 'WARNING',
    label: t(`indexer.logLevels.warning`),
  },
  {
    value: 'CRITICAL',
    label: t(`indexer.logLevels.critical`),
  },
]);

/** Containers */
const containers = ref<SelectOption[]>([
  {
    value: 'db',
    label: t(`indexer.containers.db`),
  },
  {
    value: 'init',
    label: t(`indexer.containers.init`),
  },
  {
    value: 'api',
    label: t(`indexer.containers.api`),
  },
  {
    value: 'processor',
    label: t(`indexer.containers.processor`),
  },
]);

const fetchLogsDebounced = useDebounceFn(fetchLogs, 1000);

async function fetchLogs() {
  if (indexerStore.active) {
    await indexerLogStore.fetchLogs(indexerStore.active.indexer_uuid);
  }
}
</script>
