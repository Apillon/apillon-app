<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-social-hub',
    label: t('social.chat.list'),
    path: '/dashboard/service/social/hub',
  },
  {
    key: 'dashboard-service-social-hub-archive',
    label: t('general.archive'),
    path: '/dashboard/service/social/hub/archive',
  },
];
</script>
