<template>
  <Menu :options="menuOptions" mode="horizontal"> </Menu>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-project-settings',
    label: t('pageMenu.projectSettings'),
    to: 'dashboard-project-settings',
  },
  {
    key: 'dashboard-users-permissions',
    label: t('pageMenu.usersPermissions'),
    to: 'dashboard-users-permissions',
  },
  {
    key: 'dashboard-api-keys',
    label: t('pageMenu.apiKeys'),
    to: 'dashboard-api-keys',
  },
];
</script>
