<template>
  <Dashboard :loading="pageLoading" :mainnet="assetHubStore.mainnet">
    <template #heading>
      <HeaderAssetHub back-link="/dashboard/service/asset-hub/" :title="$t('assetHub.createAsset')" />
    </template>

    <div class="mx-auto grid grid-cols-assetHub justify-center gap-4 pb-8 lg:gap-8">
      <FormAssetHub
        class="w-full min-w-40 max-w-xl flex-auto"
        @create-success="(id, network) => refreshAssets(id, network)"
        @close="router.push({ name: 'dashboard-service-asset-hub' })"
      />
      <AssetHubInfoBoxes />
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const assetHubStore = useAssetHubStore();
const { pageLoading, initAssetHub, reconnectWallet, refreshAssets } = useAssetHub();

onMounted(async () => {
  await initAssetHub();
  await reconnectWallet();

  if (!assetHubStore.account) {
    router.push({ name: 'dashboard-service-asset-hub' });
  }
});

useHead({
  title: t('dashboard.nav.assetHub'),
});
</script>
