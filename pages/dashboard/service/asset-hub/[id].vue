<template>
  <Dashboard :loading="pageLoading" :mainnet="assetHubStore.mainnet">
    <template #heading>
      <HeaderAssetHub
        back-link="/dashboard/service/asset-hub/"
        :title="`Asset: ${assetHubStore.active.name}`"
      />
    </template>

    <div class="pb-8">
      <div class="card-light px-6 py-4 mb-6">
        <n-table class="plain" :bordered="false" :single-line="true">
          <tbody>
            <tr v-for="(data, key) in assetData">
              <td :class="{ '!border-bg-light': key + 1 === assetData.length }">
                <span class="text-white">
                  {{ data.label }}
                </span>
              </td>
              <td :class="{ '!border-bg-light': key + 1 === assetData.length }">
                <Btn v-if="data.link" :href="data.link" type="link">
                  {{ data.value }}
                </Btn>
                <TableEllipsis
                  v-else-if="data.copy"
                  class="w-full justify-between"
                  :text="`${data.value}`"
                />
                <span v-else>{{ data.value }}</span>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <div class="card-light px-6 py-4">
        <h4>
          {{ $t('dashboard.service.assetHub.walletStats') }}
        </h4>
        <n-table class="plain my-4" :bordered="false" :single-line="true">
          <tbody>
            <tr>
              <td>
                <span class="text-white">{{ $t('general.available') }}</span>
              </td>
              <td>{{ assetHubStore.active.supply }} {{ assetHubStore.active.symbol }}</td>
            </tr>
          </tbody>
        </n-table>
        <a
          :href="`https://assethub-westend.subscan.io/account/${assetHubStore.active.owner}`"
          class="text-blue font-bold text-sm"
        >
          {{ $t('dashboard.service.assetHub.transactionHistory') }}
        </a>
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
const router = useRouter();
const { params } = useRoute();
const assetHubStore = useAssetHubStore();
const { pageLoading, initAssetHub, reconnectWallet } = useAssetHub();

useHead({
  title: t('dashboard.nav.assetHub'),
});

const assetId = ref<number>(Number(params?.id));
const assetData = computed<AssetData[]>(() => [
  {
    label: t('form.label.assetHub.network'),
    value: `${assetHubNetworks.westend.name} (${assetHubNetworks.westend.env})`,
  },
  { label: t('form.label.assetHub.name'), value: `${assetHubStore.active?.name}` },
  { label: t('form.label.assetHub.symbol'), value: `${assetHubStore.active?.symbol}` },
  { label: t('form.label.assetHub.assetId'), value: `${assetId.value}` },
  { label: t('form.label.assetHub.decimals'), value: `${assetHubStore.active?.decimals}` },
  {
    label: t('form.label.assetHub.initialSupply'),
    value: `${assetHubStore.active?.supply}`,
  },
  {
    label: t('form.label.assetHub.issuerAddress'),
    value: `${assetHubStore.active?.issuer}`,
    copy: true,
  },
  {
    label: t('form.label.assetHub.freezerAddress'),
    value: `${assetHubStore.active?.freezer}`,
    copy: true,
  },
  {
    label: 'On-chain metadata',
    value: 'Get here',
    link: 'https://github.com/subscan-explorer/assets-info',
  },
]);

onMounted(async () => {
  await initAssetHub();
  await reconnectWallet();

  if (!assetHubStore.account) {
    router.push({ name: 'dashboard-service-asset-hub' });
  }
  await assetHubStore.getAsset(assetId.value);
});
</script>
