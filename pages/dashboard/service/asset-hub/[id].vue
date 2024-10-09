<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderAssetHub to="/dashboard/service/asset-hub/" :title="`Asset `" />
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
import type { SelectOption } from 'naive-ui';

type AssetData = SelectOption & {
  copy?: boolean;
  link?: string;
};

const { t } = useI18n();
const { params } = useRoute();
const dataStore = useDataStore();
const { connectedAccount, getAssetDetails } = useAssetHub();

useHead({
  title: t('dashboard.nav.assetHub'),
});

const pageLoading = ref<boolean>(true);
const assetId = ref<number>(Number(params?.id));
const assetData = ref<AssetData[]>([]);

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await initAssetData(assetId.value);
      pageLoading.value = false;
    });
  }, 100);
});

watch(
  () => connectedAccount.value,
  () => {
    initAssetData(assetId.value);
  }
);

async function initAssetData(assetId: number) {
  const data = await getAssetDetails(assetId);
  console.log(data);
  
  assetData.value = [
    { label: t('form.label.assetHub.network'), value: '' },
    { label: t('form.label.assetHub.name'), value: data?.name },
    { label: t('form.label.assetHub.symbol'), value: data?.symbol },
    { label: t('form.label.assetHub.assetId'), assetId },
    { label: t('form.label.assetHub.decimals'), value: data?.decimals },
    { label: t('form.label.assetHub.initialSupply'), value: data?.supply },
    {
      label: t('form.label.assetHub.issuerAddress'),
      value: data?.issuer,
      copy: true,
    },
    {
      label: t('form.label.assetHub.freezerAddress'),
      value: data?.freezer,
      copy: true,
    },
    {
      label: 'On-chain metadata',
      value: 'Get here',
      link: 'https://github.com/subscan-explorer/assets-info',
    },
  ];
}
</script>
