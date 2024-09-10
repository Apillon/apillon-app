<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <h4 class="text-center">{{ $t('computing.cloudFunctions.usage.title') }}</h4>
        <ChartLine v-if="chartData" :data="chartData" />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

const { t } = useI18n();
const cloudFunctionStore = useCloudFunctionStore();
const { pageLoading, init } = useCloudFunctions();

const chartData = ref();

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await init();
  await cloudFunctionStore.getUsage(cloudFunctionStore.functionUuid);
  chartData.value = prepareData();
});

const prepareData = () => {
  const data: Record<string, { success: number; error: number }> = {};

  cloudFunctionStore.usage.forEach(item => {
    const date = new Date(item.timestamp);
    const label = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    if (!(label in data)) {
      data[label] = { success: 0, error: 0 };
    }
    if (item.success) {
      data[label].success += 1;
    } else if (item.error) {
      data[label].error += 1;
    }
  });

  const labels = Object.keys(data);

  const dataSuccess = Object.values(data)
    .map(value => value.success)
    .reverse();

  const dataError = Object.values(data)
    .map(value => value.error)
    .reverse();

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
        data: dataSuccess,
        fill: true,
      },
      {
        label: 'Error',
        backgroundColor: colors.pink,
        data: dataError,
        fill: true,
      },
    ],
  };
};
</script>
