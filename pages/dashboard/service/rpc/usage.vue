<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderRpc />
    </template>

    <n-space v-if="rpcApiKeyStore.hasRpcApiKeys" class="pb-8" :size="32" vertical>
      <ActionsRpc />
      <ChartLine v-if="chartData" :data="chartData" />
      <div v-else class="flex-cc min-h-40">
        <h2>No RPC usage has been detected yet.</h2>
      </div>
    </n-space>
    <RpcNoApiKeys v-else />
  </Dashboard>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import colors from '~/tailwind.colors';

const { t } = useI18n();
const dataStore = useDataStore();
const rpcApiKeyStore = useRpcApiKeyStore();

const pageLoading = ref<boolean>(true);
const chartData = ref();
const initialLoadComplete = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.rpc'),
});

onMounted(async () => {
  await sleep(100);
  await Promise.all(Object.values(dataStore.promises));

  await rpcApiKeyStore.getApiKeys();

  if (!rpcApiKeyStore.selectedId && rpcApiKeyStore.items.length > 0) {
    rpcApiKeyStore.selectedId = rpcApiKeyStore.items[0].id;
  }

  await rpcApiKeyStore.getRpcApiKeyUsage();

  if (rpcApiKeyStore.usage) {
    chartData.value = prepareData(rpcApiKeyStore.usage);
  }

  pageLoading.value = false;
  initialLoadComplete.value = true;
});

function formatDate(timestamp: string): string {
  const timestampNumber = parseInt(timestamp);
  const date = new Date(timestampNumber * 1000);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const prepareData = (usage: RpcApiKeyUsageInterface) => {
  const requests = Object.keys(usage.per_day).map(key => {
    return usage.per_day[key].requests;
  });

  return {
    labels: Object.keys(usage.per_day).map(formatDate),
    color: colors.bg.light,
    chartArea: {
      backgroundColor: colors.bg.light,
    },
    datasets: [
      {
        label: t('rpc.usage.requestsNumber'),
        backgroundColor: colors.green,
        borderColor: colors.green,
        data: requests,
        fill: false,
      },
    ],
  };
};

const options = computed<SelectOption[]>(() =>
  rpcApiKeyStore.items.map(item => ({
    value: item.id,
    label: item.name,
  }))
);

watch(
  () => rpcApiKeyStore.selectedId,
  async newId => {
    if (initialLoadComplete.value && newId) {
      pageLoading.value = true;

      rpcApiKeyStore.handleSelectedIdChange();

      await rpcApiKeyStore.getRpcApiKeyUsage();

      pageLoading.value = false;
    }
  }
);
</script>
