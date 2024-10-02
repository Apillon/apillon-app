<template>
  <Dashboard>
    <template #heading>
      <HeaderAssetHub
        back-link="/dashboard/service/asset-hub/"
        :title="$t('dashboard.service.assetHub.createAsset')"
      />
    </template>

    <div class="pb-8">
      <FormAssetHub class="mx-auto" />
    </div>
    <template #learn>
      <AssetHubInfoBoxes class="h-full" />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: t('dashboard.nav.assetHub'),
});
</script>
