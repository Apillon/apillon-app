<template>
  <Dashboard :empty="!dataStore.project.selected || !cloudFunctionStore.hasCloudFunctions" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        docs="https://wiki.apillon.io/web3-services/8-web3-cloud-functions.html"
        :name="toCamelCase(ServiceTypeName.CLOUD_FUNCTIONS)"
        :service="ServiceTypeName.CLOUD_FUNCTIONS"
        :guides="serviceGuides"
      >
        <template #actions>
          <Btn size="large" @click="modalCreateCloudFunctionsVisible = true">
            {{ $t('computing.cloudFunctions.new') }}
          </Btn>
        </template>
        <modal v-model:show="modalCreateCloudFunctionsVisible" :title="$t('computing.cloudFunctions.new')">
          <FormCloudFunctions @submit-success="modalCreateCloudFunctionsVisible = false" />
        </modal>
      </ServiceEmpty>
    </template>
    <template #heading>
      <HeaderCloudFunctions />
    </template>
    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsCloudFunctions />
        <TableComputingCloudFunctions :functions="cloudFunctionStore.items" />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const cloudFunctionStore = useCloudFunctionStore();

const pageLoading = ref<boolean>(true);
const modalCreateCloudFunctionsVisible = ref<boolean | null>(false);

const serviceGuides = [
  {
    title: 'Cloud functions vs. traditional cloud hosting',
    content:
      'Discover when cloud functions are the smarter choice over traditional hosting — save on costs, scale effortlessly, and focus on what…',
    link: 'https://blog.apillon.io/cloud-functions-vs-traditional-cloud-hosting-827888bb32a3/',
  },
  {
    title: 'Ultimate 5 cloud computing trends to watch in 2025',
    content:
      'The cloud isn’t just floating — it’s storming into 2025 with serverless innovations, decentralization, and AI-driven upgrades.',
    link: 'https://blog.apillon.io/ultimate-5-cloud-computing-trends-to-watch-in-2025-84c8aa697ed2/',
  },
];

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await cloudFunctionStore.getCloudFunctions();

  pageLoading.value = false;
});
</script>
