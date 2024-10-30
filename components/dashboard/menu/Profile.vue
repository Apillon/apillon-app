<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-account-management',
    label: t('dashboard.pageMenu.accountManagement'),
    to: 'dashboard-account-management',
  },
  {
    key: 'profile',
    label: t('dashboard.pageMenu.profile'),
    to: 'profile',
  },
];
</script>
