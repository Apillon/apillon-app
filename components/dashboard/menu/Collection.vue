<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const collectionStore = useCollectionStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-nft',
    label: t('dashboard.nav.nft'),
    counter: collectionStore.items.length,
    path: '/dashboard/service/nft',
  },
  {
    key: 'dashboard-service-nft-archive',
    label: t('general.archive'),
    counter: collectionStore.archive.items.length,
    path: '/dashboard/service/nft/archive',
  },
];
</script>
