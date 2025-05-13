<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="flex">
      <FormFieldSearch v-model:value="indexerLogStore.search" class="w-[20vw] min-w-[11rem] max-w-xs" />

      <!-- <n-date-picker
        v-model:value="indexerLogStore.filter.dateFrom"
        class="max-w-xs ml-2"
        type="datetime"
        size="medium"
        clearable
      /> -->

      <!-- Filter log level -->
      <select-options
        v-model:value="indexerLogStore.filter.logLevels"
        :options="logLevels"
        :placeholder="$t('form.placeholder.indexer.logLevels')"
        size="medium"
        class="ml-2 w-[20vw] min-w-[11rem] max-w-xs"
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
        size="medium"
        class="ml-2 w-[20vw] min-w-[11rem] max-w-xs"
        filterable
        clearable
        multiple
        @update:value="fetchLogsDebounced"
      />
    </div>

    <n-space size="large">
      <!-- Refresh -->
      <n-button
        size="medium"
        :loading="indexerLogStore.loading"
        @click="indexerLogStore.fetchLogs(indexerStore.active.indexer_uuid)"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
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
