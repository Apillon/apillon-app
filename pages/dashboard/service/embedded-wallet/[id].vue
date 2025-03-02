<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderEmbeddedWallet />
    </template>

    <slot>
      <n-space :size="32" class="relative pb-8" vertical>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <n-card class="card-dark" size="small" :bordered="false" title="Number of integrations">
            <h4 class="text-primary">
              {{ embeddedWalletStore.info.numOfEWIntegrations }}
            </h4>
          </n-card>
          <n-card
            class="card-dark"
            size="small"
            :bordered="false"
            title="Max number of integrations"
          >
            <h4 class="text-primary">{{ embeddedWalletStore.info.maxNumOfEWIntegrations }}</h4>
          </n-card>
          <n-card
            class="card-dark"
            size="small"
            :bordered="false"
            title="Generated wallets this month"
          >
            <h4 class="text-primary">
              {{ embeddedWalletStore.info.numOfEWSignaturesForCurrentMonth }}
            </h4>
          </n-card>
          <n-card class="card-dark" size="small" :bordered="false" title="Max wallets per month">
            <h4 class="text-primary">{{ embeddedWalletStore.info.maxNumOfEWSignatures }}</h4>
          </n-card>
        </div>
        <div class="flex justify-end mr-4">
          <n-button
            size="small"
            :loading="embeddedWalletStore.loading"
            @click="
              embeddedWalletStore.fetchSignatures(
                embeddedWalletStore.integrationUuid,
                embeddedWalletStore.signature.pagination.page || 1,
                embeddedWalletStore.signature.pagination.pageSize
              )
            "
          >
            <span class="icon-refresh text-xl mr-2"></span>
            {{ $t('general.refresh') }}
          </n-button>
        </div>

        <TableEmbeddedWalletSignatures />

        <div>
          <h3 class="mb-4">{{ $t('embeddedWallet.table.usage') }}</h3>
          <ChartLine v-if="chartData" :data="chartData" />
        </div>

        <EmbeddedWalletCodeSnippet />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import colors from '~/tailwind.colors';

const { t } = useI18n();
const { params } = useRoute();
const router = useRouter();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();

const pageLoading = ref<boolean>(true);
const chartData = ref();

useHead({
  title: t('embeddedWallet.title'),
});

onMounted(async () => {
  await sleep(10);

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const walletUuid = `${params?.id}` || '';
    const embeddedWallet = await embeddedWalletStore.getEmbeddedWallet(walletUuid);

    if (!embeddedWallet) {
      router.push({ name: 'dashboard-service-embedded-wallet' });
      return;
    }
    embeddedWalletStore.active = embeddedWallet;
    chartData.value = prepareData(embeddedWallet.usage);

    await embeddedWalletStore.getInfo();
    await embeddedWalletStore.getSignatures(walletUuid);
  });
  pageLoading.value = false;
});

const prepareData = (usage: EmbeddedWalletUsage[]) => {
  const labels = usage.map(item => {
    const date = new Date(item.date);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  });
  const graphData = usage.map(item => item.countOfSignatures);

  return {
    labels,
    color: colors.bg.light,
    chartArea: {
      backgroundColor: colors.bg.light,
    },
    datasets: [
      {
        label: 'Wallets per day',
        backgroundColor: colors.green,
        borderColor: colors.white,
        data: graphData,
        fill: true,
        borderWidth: 1,
      },
    ],
  };
};
</script>
