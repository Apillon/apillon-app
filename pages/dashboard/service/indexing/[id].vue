<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderIndexer :indexer-uuid="indexerStore.active.indexer_uuid" />
    </template>

    <slot v-if="indexerStore.active.indexer_uuid">
      <n-space v-if="indexerStore.active?.squidId" class="pb-8" :size="24" vertical>
        <ActionsIndexerGeneral />
        <div class="flex flex-wrap gap-x-6 gap-y-8 pb-8 lg:flex-nowrap">
          <div class="lg:w-1/2">
            <h4 class="mb-4">{{ $t('indexer.indexerGeneralData') }}</h4>
            <TableIndexerGeneral />
          </div>
          <div class="lg:w-1/2">
            <h4 class="mb-4">{{ $t('indexer.usageData') }}</h4>
            <ChartLine v-if="chartData" class="max-w-3xl" :data="chartData" />
          </div>
        </div>
      </n-space>
      <IndexerInstructionsDeploy v-else />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { colors } from '~/tailwind.config';

const { t } = useI18n();
const indexerStore = useIndexerStore();
const { pageLoading, initIndexer } = useIndexer();
const chartData = ref();

useHead({
  title: t('dashboard.nav.indexing'),
});

onMounted(async () => {
  await initIndexer();

  if (indexerStore.active.indexer_uuid && indexerStore.active.squidId) {
    await indexerStore.getIndexerUsage(indexerStore.active.indexer_uuid);
    chartData.value = prepareUsageData();
  }
});

const prepareUsageData = () => {
  const data: Record<string, { success: number; error: number }> = {};

  indexerStore.usageMetrics.forEach(item => {
    const date = new Date(item.ts);
    const label = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    data[label] = { success: item.success.count, error: item.error.count };
  });

  const labels = Object.keys(data);
  const dataSuccess = Object.values(data).map(value => value.success);
  const dataError = Object.values(data).map(value => value.error);

  return {
    labels,
    color: colors.bg.light,
    chartArea: {
      backgroundColor: colors.bg.light,
    },
    datasets: [
      {
        label: 'Success',
        backgroundColor: colors.green,
        borderColor: colors.white.DEFAULT,
        data: dataSuccess,
        fill: true,
        borderWidth: 1,
      },
      {
        label: 'Error',
        backgroundColor: colors.pink,
        borderColor: colors.white.DEFAULT,
        data: dataError,
        fill: true,
        borderWidth: 1,
      },
    ],
  };
};
</script>
