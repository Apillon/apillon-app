<template>
  <h4 class="mb-8">{{ $t('dashboard.projectResources') }}</h4>

  <div class="grid lg:grid-cols-3 sm:grid-cols-2 gap-8">
    <div v-for="(service, key) in web3Services" :key="key" class="card-light p-8">
      <div class="flex items-center gap-2 mb-6">
        <span
          class="text-2xl"
          :class="[
            service.icon,
            key % 3 === 0 ? 'text-blue' : key % 3 === 1 ? 'text-pink' : 'text-orange',
          ]"
        ></span>
        <h5>{{ $t(`dashboard.service.${service.name}.name`) }}</h5>
      </div>
      <div class="text-sm pb-1 mb-3 border-b border-bg-lighter">
        <div
          v-for="(serviceData, dataKey) in service.data"
          :key="dataKey"
          class="flex justify-between items-center pb-2"
        >
          <span class="text-body">
            {{ serviceData.name }}
          </span>
          <div class="relative text-right min-w-[1rem]">
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
        name: t(`dashboard.service.storage.bucketCount`),
        value: dataStore.project.overview.bucketCount,
      },
      {
        name: t(`dashboard.service.storage.fileCount`),
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
        name: t(`dashboard.service.hosting.websiteCount`),
        value: dataStore.project.overview.websiteCount,
      },
      {
        name: t(`dashboard.service.hosting.usedBandwidth`),
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
        name: t(`dashboard.service.nft.collectionCount`),
        value: dataStore.project.overview.collectionCount,
      },
      {
        name: t(`dashboard.service.nft.nftTransactionCount`),
        value: dataStore.project.overview.nftTransactionCount,
      },
    ],
  },
  {
    id: ServiceType.AUTHENTICATION,
    name: 'authentication',
    icon: 'icon-authentication',
    data: [
      {
        name: t(`dashboard.service.authentication.didCount`),
        value: dataStore.project.overview.didCount,
      },
    ],
  },
  {
    id: ServiceType.COMPUTING,
    name: 'computing',
    icon: 'icon-computing',
    data: [
      {
        name: t(`dashboard.service.computing.contractCount`),
        value: dataStore.project.overview.contractCount,
      },
      {
        name: t(`dashboard.service.computing.computingTransactionCount`),
        value: dataStore.project.overview.computingTransactionCount,
      },
    ],
  },
  {
    id: ServiceType.SOCIAL,
    name: 'social',
    icon: 'icon-social',
    data: [
      {
        name: t(`dashboard.service.social.spaceCount`),
        value: dataStore.project.overview.spaceCount,
      },
      {
        name: t(`dashboard.service.social.postCount`),
        value: dataStore.project.overview.postCount,
      },
    ],
  },
]);

onMounted(async () => {
  await sleep(500);

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    storageStore.getStorageInfo();
    await dataStore.getProjectOverview(dataStore.projectUuid);

    loading.value = false;
  });
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
