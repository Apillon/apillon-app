<template>
  <Dashboard :loading="pageLoading" :mainnet="assetHubStore.mainnet">
    <template #heading>
      <HeaderAssetHub back-link="/dashboard/service/asset-hub/" :title="`Asset: ${assetHubStore.active.name}`" />
    </template>

    <div class="pb-8">
      <div class="card-light mb-6 px-6 py-4">
        <TableInfo :data="assetData" />
      </div>

      <div class="card-light px-6 py-4">
        <h4>
          {{ $t('assetHub.walletStats') }}
        </h4>
        <n-table class="plain my-4" :bordered="false" :single-line="true">
          <tbody>
            <tr>
              <td>
                <span class="text-white">{{ $t('general.available') }}</span>
              </td>
              <td>{{ supply }} {{ assetHubStore.active.symbol }}</td>
            </tr>
          </tbody>
        </n-table>
        <a :href="transactionsList" class="text-sm font-bold text-blue" target="_blank">
          {{ $t('assetHub.transactionHistory') }}
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
const { pageLoading, supply, initAssetHub, reconnectWallet } = useAssetHub();

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
  { label: t('form.label.assetHub.id'), value: `${assetId.value}` },
  { label: t('form.label.assetHub.decimals'), value: `${assetHubStore.active?.decimals}` },
  {
    label: t('form.label.assetHub.supply'),
    value: `${supply.value}`,
  },
  {
    label: t('form.label.assetHub.issuer'),
    value: `${assetHubStore.active?.issuer}`,
    copy: true,
  },
  {
    label: t('form.label.assetHub.freezer'),
    value: `${assetHubStore.active?.freezer}`,
    copy: true,
  },
  {
    label: 'On-chain metadata',
    value: 'Get here',
    link: 'https://github.com/subscan-explorer/assets-info',
  },
]);

const transactionsList = computed(() =>
  assetHubStore.mainnet
    ? `https://assethub-polkadot.subscan.io/assets/${assetHubStore.active.id}?tab=activity`
    : `https://assethub-westend.subscan.io/assets/${assetHubStore.active.id}?tab=activity`
);

onMounted(async () => {
  await initAssetHub();
  await reconnectWallet();

  if (!assetHubStore.account) {
    router.push({ name: 'dashboard-service-asset-hub' });
  }
  await assetHubStore.getAsset(assetId.value);
});
</script>
