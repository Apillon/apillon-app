<template>
  <div class="card-light mb-6 max-w-3xl px-6 py-4">
    <TableInfo :data="data" />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const indexerStore = useIndexerStore();

const data = computed(() => {
  return [
    {
      label: t('indexer.name'),
      value: indexerStore.active.name,
    },
    {
      label: t('indexer.description'),
      value: indexerStore.active.description,
    },
    {
      label: t('dashboard.createTime'),
      value: dateTimeToDateAndTime(indexerStore.active.createTime || ''),
    },
    {
      label: t('indexer.lastDeployed'),
      value: dateTimeToDateAndTime(indexerStore.active.squid?.deployedAt || ''),
    },
    {
      label: t('indexer.squidStatus'),
      value: indexerStore.active.squid?.status,
      component: resolveComponent('IndexerStatus'),
      data: {
        status: indexerStore.active.squid?.status == 'DEPLOYED' ? 'success' : 'error',
      },
    },
    {
      label: t('indexer.apiStatus'),
      value: indexerStore.active.squid?.api?.status,
      component: resolveComponent('IndexerStatus'),
      data: {
        status: indexerStore.active.squid?.api?.status == 'AVAILABLE' ? 'success' : 'error',
      },
    },
    {
      label: t('indexer.processors'),
      value: '',
      classLabel: '!h-6 !border-bg-light !pl-0 !pt-5 font-semibold text-white',
      classValue: '!border-bg-light',
    },
    {
      label: t('indexer.processorStatus'),
      value: indexerStore.active.squid?.processors[0].status,
      component: resolveComponent('IndexerStatus'),
      data: {
        status: indexerStore.active.squid?.processors[0].status == 'SYNCED' ? 'success' : 'error',
      },
    },
    {
      label: t('indexer.processedBlocks'),
      value: `${indexerStore.active.squid?.processors[0].syncState.currentBlock}/${indexerStore.active.squid?.processors[0].syncState.totalBlocks}`,
    },
  ];
});
</script>
