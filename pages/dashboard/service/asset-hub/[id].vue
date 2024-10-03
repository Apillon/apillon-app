<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderAssetHub
        to="/dashboard/service/asset-hub/"
        :title="`Asset ${assetHubStore.active.name}`"
      />
    </template>

    <div class="pb-8">
      <div class="card-light px-6 py-4 mb-6">
        <n-table class="plain" :bordered="false" :single-line="true">
          <tbody>
            <tr v-for="data in assetData">
              <td>
                <span class="text-white">
                  {{ data.label }}
                </span>
              </td>
              <td>
                <Btn v-if="data.link" :href="data.link" type="link">
                  {{ data.value }}
                </Btn>
                <TableEllipsis
                  v-else-if="data.copy"
                  class="w-full justify-between"
                  :text="data.value"
                />
                <span v-else>{{ data.value }}</span>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <div class="card-light px-6 py-4">
        <h4>Connected wallet stats</h4>
        <n-table class="plain my-4" :bordered="false" :single-line="true">
          <tbody>
            <tr>
              <td>
                <span class="text-white">Available</span>
              </td>
              <td>10020 NCTR</td>
            </tr>
          </tbody>
        </n-table>
        <a href="" class="text-blue font-bold text-sm">View transaction history</a>
      </div>
    </div>

    <template #learn>
      <AssetHubActions />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const assetHubStore = useAssetHubStore();

useHead({
  title: t('dashboard.nav.assetHub'),
});

const pageLoading = ref<boolean>(true);

const assetData = [
  { label: t('form.label.assetHub.network'), value: 'Testnet/Mainnet' },
  { label: t('form.label.assetHub.name'), value: 'Apillon' },
  { label: t('form.label.assetHub.symbol'), value: 'NCTR' },
  { label: t('form.label.assetHub.assetId'), value: '1337' },
  { label: t('form.label.assetHub.decimals'), value: '18' },
  { label: t('form.label.assetHub.initialSupply'), value: '150.000.000' },
  {
    label: t('form.label.assetHub.issuerAddress'),
    value: '0xe4302A01F70fa56c5f40bEf998a21757b6...',
    copy: true,
  },
  {
    label: t('form.label.assetHub.freezerAddress'),
    value: '0xe4302A01F70fa56c5f40bEf998a21757b6...',
    copy: true,
  },
  {
    label: 'On-chain metadata',
    value: 'Get here',
    link: 'https://github.com/subscan-explorer/assets-info',
  },
];

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      pageLoading.value = false;
    });
  }, 100);
});
</script>
