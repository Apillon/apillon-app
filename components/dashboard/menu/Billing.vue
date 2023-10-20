<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-billing',
    label: t('dashboard.pageMenu.subscription'),
    to: 'dashboard-billing',
  },
  {
    key: 'dashboard-credits',
    label: t('dashboard.pageMenu.credits'),
    to: 'dashboard-credits',
  },
  {
    key: 'dashboard-price-list',
    label: t('dashboard.pageMenu.priceList'),
    to: 'dashboard-price-list',
  },
];
</script>
