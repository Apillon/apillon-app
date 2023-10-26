<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-billing',
    label: t('dashboard.pageMenu.billing'),
    to: 'dashboard-billing',
  },
  {
    key: 'dashboard-price-list',
    label: t('dashboard.pageMenu.priceList'),
    to: 'dashboard-price-list',
  },
];
</script>
