<template>
  <menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-project-settings',
    label: t('dashboard.pageMenu.projectSettings'),
    to: 'dashboard-project-settings',
  },
  {
    key: 'dashboard-users-permissions',
    label: t('dashboard.pageMenu.usersPermissions'),
    to: 'dashboard-users-permissions',
  },
  {
    key: 'dashboard-api-keys',
    label: t('dashboard.pageMenu.apiKeys'),
    to: 'dashboard-api-keys',
  },
];
</script>
