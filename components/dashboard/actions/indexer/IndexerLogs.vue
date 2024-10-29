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

const $i18n = useI18n();
const indexerStore = useIndexerStore();
const indexerLogStore = useIndexerLogStore();

/** Log levels */
const logLevels = ref<SelectOption[]>([
  {
    value: 'ERROR',
    label: $i18n.t(`indexer.logLevels.error`),
  },
  {
    value: 'DEBUG',
    label: $i18n.t(`indexer.logLevels.debug`),
  },
  {
    value: 'INFO',
    label: $i18n.t(`indexer.logLevels.info`),
  },
  {
    value: 'NOTICE',
    label: $i18n.t(`indexer.logLevels.notice`),
  },
  {
    value: 'WARNING',
    label: $i18n.t(`indexer.logLevels.warning`),
  },
  {
    value: 'CRITICAL',
    label: $i18n.t(`indexer.logLevels.critical`),
  },
]);

/** Containers */
const containers = ref<SelectOption[]>([
  {
    value: 'db',
    label: $i18n.t(`indexer.containers.db`),
  },
  {
    value: 'init',
    label: $i18n.t(`indexer.containers.init`),
  },
  {
    value: 'api',
    label: $i18n.t(`indexer.containers.api`),
  },
  {
    value: 'processor',
    label: $i18n.t(`indexer.containers.processor`),
  },
]);
</script>
