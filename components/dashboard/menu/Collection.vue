<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-nft',
    label: t('dashboard.nav.nft'),
    path: '/dashboard/service/nft',
  },
  {
    key: 'dashboard-service-nft-archive',
    label: t('general.archive'),
    path: '/dashboard/service/nft/archive',
  },
];
</script>
