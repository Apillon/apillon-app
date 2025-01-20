<template>
  <Dashboard :loading="pageLoading" :mainnet="assetHubStore.mainnet">
    <template #heading>
      <HeaderAssetHub
        back-link="/dashboard/service/asset-hub/"
        :title="$t('dashboard.service.assetHub.createAsset')"
      />
    </template>

    <div class="grid grid-cols-assetHub justify-center gap-4 lg:gap-8 pb-8 mx-auto">
      <FormAssetHub
        class="flex-auto w-full min-w-40 max-w-xl"
        @create-success="(id, network) => refreshAssets(id, network)"
        @close="$router.push({ name: 'dashboard-service-asset-hub' })"
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
