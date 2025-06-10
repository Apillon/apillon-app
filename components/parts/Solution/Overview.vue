<template>
  <h4 class="mb-8">{{ $t('dashboard.projectResources') }}</h4>

  <div class="grid grid-cols-billing gap-4">
    <div v-for="(service, key) in web3Services" :key="key" class="card-light p-8">
      <div class="mb-6 flex items-center gap-2">
        <span
          class="text-2xl"
          :class="[service.icon, key % 3 === 0 ? 'text-blue' : key % 3 === 1 ? 'text-pink' : 'text-orange']"
        ></span>
        <h5>{{ $t(`service.${service.name}.name`) }}</h5>
      </div>
      <div class="mb-3 border-b border-bg-lighter pb-1 text-sm">
        <div
          v-for="(serviceData, dataKey) in service.data"
          :key="dataKey"
          class="flex items-center justify-between pb-2"
        >
          <span class="text-body">
            {{ serviceData.name }}
          </span>
          <div class="relative min-w-[1rem] text-right">
            <Spinner v-if="loading" :size="14" />
            <span v-else>
              {{ serviceData.value }}
            </span>
          </div>
        </div>
      </div>

      <StorageProgress
        v-if="service.progress"
        :key="service.progress.used"
        :size="service.progress.used"
        :max-size="service.progress.available"
        wrap
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  img: { type: String, default: '' },
});
const { t } = useI18n();
const dataStore = useDataStore();
const storageStore = useStorageStore();

const loading = ref<boolean>(true);

const web3Services = computed(() => [
  {
    id: ServiceType.STORAGE,
    name: 'storage',
    icon: 'icon-storage',
    data: [
      {
        name: t(`service.storage.bucketCount`),
        value: dataStore.project.overview.bucketCount,
      },
      {
        name: t(`service.storage.fileCount`),
        value: dataStore.project.overview.fileCount,
      },
    ],
    progress: {
      used: dataStore.project.overview.usedStorage,
      available: dataStore.project.overview.availableStorage,
    },
  },
  {
    id: ServiceType.HOSTING,
    name: 'hosting',
    icon: 'icon-hosting',
    data: [
      {
        name: t(`service.hosting.websiteCount`),
        value: dataStore.project.overview.websiteCount,
      },
      {
        name: t(`service.hosting.usedBandwidth`),
        value: formatBytes(dataStore.project.overview.usedBandwidth),
      },
    ],
    progress: {
      used: dataStore.project.overview.usedBandwidth,
      available: dataStore.project.overview.availableBandwidth,
    },
  },
  {
    id: ServiceType.NFT,
    name: 'nft',
    icon: 'icon-nft',
    data: [
      {
        name: t(`service.nft.collectionCount`),
        value: dataStore.project.overview.numOfCollections || dataStore.project.overview.collectionCount,
      },
      {
        name: t(`service.nft.nftTransactionCount`),
        value: dataStore.project.overview.nftTransactionCount,
      },
    ],
  },
  {
    id: ServiceType.EMBEDDED_WALLET,
    name: 'embeddedWallet',
    icon: 'icon-wallet',
    data: [
      {
        name: t('service.embeddedWallet.integrationCount'),
        value: dataStore.project.overview.integrationCount,
      },
      {
        name: t('service.embeddedWallet.walletCount'),
        value: dataStore.project.overview.embeddedWalletCount,
      },
    ],
  },
  {
    id: 99,
    name: 'cloudFunctions',
    icon: 'icon-cloud-functions',
    data: [
      {
        name: t('service.cloudFunctions.functionCount'),
        value: dataStore.project.overview.cloudFunctionCount,
      },
      {
        name: t('service.cloudFunctions.deploymentCount'),
        value: dataStore.project.overview.cloudFunctionJobCount,
      },
    ],
  },
  {
    id: ServiceType.RPC,
    name: 'rpc',
    icon: 'icon-rpc',
    data: [
      {
        name: t('service.rpc.keyCount'),
        value: dataStore.project.overview.rpcApiKeyCount,
      },
      {
        name: t('service.rpc.selectedNetworkCount'),
        value: dataStore.project.overview.selectedRpcUrlCount,
      },
    ],
  },
  {
    id: ServiceType.INDEXING,
    name: 'indexing',
    icon: 'icon-indexer',
    data: [
      {
        name: t('service.indexing.deployedIndexerCount'),
        value: dataStore.project.overview.indexerCount,
      },
    ],
  },
  {
    id: ServiceType.SMART_CONTRACTS,
    name: 'smartContracts',
    icon: 'icon-file',
    data: [
      {
        name: t('smartContracts.deployedContractsCount'),
        value: dataStore.project.overview.smartContractDeploymentCount,
      },
      {
        name: t('smartContracts.transactionCount'),
        value: dataStore.project.overview.smartContractTransactionCount,
      },
    ],
  },
  {
    id: ServiceType.AUTHENTICATION,
    name: 'authentication',
    icon: 'icon-authentication',
    data: [
      {
        name: t(`service.authentication.didCount`),
        value: dataStore.project.overview.didCount,
      },
    ],
  },
]);

onMounted(async () => {
  await sleep(300);
  await dataStore.waitOnPromises();

  storageStore.getStorageInfo();
  await dataStore.getProjectOverview(dataStore.projectUuid);

  loading.value = false;
});

watch(
  () => dataStore.projectUuid,
  async _ => {
    loading.value = true;

    await dataStore.getProjectOverview(dataStore.projectUuid);
    loading.value = false;
  }
);
</script>
