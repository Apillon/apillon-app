<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderAssetHub
        back-link="/dashboard/service/asset-hub/"
        :title="$t('dashboard.service.assetHub.createAsset')"
      />
    </template>

    <div class="pb-8">
      <FormAssetHub
        class="mx-auto"
        @close="$router.push({ name: 'dashboard-service-asset-hub' })"
      />
    </div>
    <template #learn>
      <AssetHubInfoBoxes class="h-full" />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const assetHubStore = useAssetHubStore();
const { pageLoading, initAssetHub, reconnectWallet } = useAssetHub();

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
