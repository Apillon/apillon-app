<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderEmbeddedWallet />
    </template>

    <slot>
      <div class="relative pb-8">
        <h2 class="mb-4">Start building</h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <n-card class="card-dark" size="small" :bordered="false" title="Number of signatures">
            <h4 class="text-primary">
              {{ embeddedWalletStore.info.numOfEWSignaturesForCurrentMonth }}
            </h4>
          </n-card>
          <n-card class="card-dark" size="small" :bordered="false" title="Max number of signatures">
            <h4 class="text-primary">{{ embeddedWalletStore.info.maxNumOfEWSignatures }}</h4>
          </n-card>
        </div>

        <h3 class="mb-4">{{ $t('embeddedWallet.table.usage') }}</h3>
        <ChartLine v-if="chartData" :data="chartData" />

        <div class="absolute right-4 flex gap-4 mb-4">
          <!-- View documentation -->
          <n-button
            size="small"
            href="https://wiki.apillon.io/web3-services/8-embedded-wallets.html"
          >
            <span class="icon-file text-xl mr-2"></span>
            {{ $t('embeddedWallet.viewDocumentation') }}
          </n-button>

          <NuxtLink :to="{ name: 'dashboard-api-keys' }">
            <n-button size="small">
              <span class="icon-magic-link text-xl text-primary mr-2"></span>
              <span class="text-primary">{{ $t('embeddedWallet.goToApiKey') }}</span>
            </n-button>
          </NuxtLink>
        </div>

        <TableEmbeddedWalletSignatures />

        <EmbeddedWalletCodeSnippet />
      </div>
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
        label: 'Count if signatures',
        backgroundColor: colors.green,
        data: graphData,
        fill: true,
      },
    ],
  };
};
</script>
