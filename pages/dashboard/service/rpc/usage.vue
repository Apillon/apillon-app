<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderRpc />
    </template>

    <n-space v-if="rpcApiKeyStore.hasRpcApiKeys" class="pb-8" :size="32" vertical>
      <ActionsRpc />
      <ChartLine v-if="chartData?.labels.length" :data="chartData" />
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

  await rpcApiKeyStore.getRpcApiKeyUsagePerChain();

  if (rpcApiKeyStore.usagePerChain) {
    chartData.value = prepareData(rpcApiKeyStore.usagePerChain);
  }

  pageLoading.value = false;
  initialLoadComplete.value = true;
});

// Format date to human-readable format (e.g., YYYY-MM-DD)
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-CA', options).format(new Date(dateString));
}

function getSortedUniqueDatesDesc(data: RpcApiKeyUsagePerChainInterface): string[] {
  // Use a Set to store unique dates from all keys.
  const dateSet = new Set<string>();

  // Iterate over each key in the data object.
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const entries = data[key];

      // Add each date to the Set to ensure uniqueness.
      entries.forEach(entry => dateSet.add(entry.date));
    }
  }

  // Convert the Set to an array, then sort it in descending order.
  return Array.from(dateSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}

function getRequestsPerChainPerDate(
  data: RpcApiKeyUsagePerChainInterface,
  sortedDates: string[]
): { name: string; requests: number[] }[] {
  const requestsPerChain: { name: string; requests: number[] }[] = [];

  // Iterate over each chain in the data object.
  for (const chain in data) {
    if (data.hasOwnProperty(chain)) {
      // Create a map of dates to requests for easy lookup.
      const dateToRequests = new Map<string, number>(
        data[chain].map(entry => [entry.date, entry.requests])
      );

      // Populate requests array for each date in sortedDates.
      const requestsArray = sortedDates.map(date => dateToRequests.get(date) ?? 0);

      // Add the result to the output array.
      requestsPerChain.push({ name: chain, requests: requestsArray });
    }
  }

  return requestsPerChain;
}

const prepareData = (usage: RpcApiKeyUsagePerChainInterface) => {
  const dates = getSortedUniqueDatesDesc(usage);
  const requestsPerChain = getRequestsPerChainPerDate(usage, dates);

  const colorPalette = [
    colors.green,
    colors.blue,
    colors.yellow,
    colors.white,
    colors.pink,
    colors.orange,
    colors.discord,
    colors.violet,
    colors.body,
  ];

  return {
    labels: dates.map(formatDate),
    color: colors.bg.light,
    chartArea: {
      backgroundColor: colors.bg.light,
    },
    datasets: requestsPerChain.map((requests, index) => ({
      active: true,
      label: requests.name,
      backgroundColor: colorPalette[index % colorPalette.length],
      borderColor: colorPalette[index % colorPalette.length],
      data: requests.requests,
      fill: false,
    })),
  };
};

watch(
  () => rpcApiKeyStore.selectedId,
  async newId => {
    if (initialLoadComplete.value && newId) {
      pageLoading.value = true;

      rpcApiKeyStore.handleSelectedIdChange();

      await rpcApiKeyStore.getRpcApiKeyUsagePerChain();

      pageLoading.value = false;
    }
  }
);
</script>
