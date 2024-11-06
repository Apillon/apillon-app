<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-service-social',
    label: t('social.post.list'),
    path: '/dashboard/service/social',
  },
  {
    key: 'dashboard-service-social-archive',
    label: t('general.archive'),
    path: '/dashboard/service/social/archive',
  },
];
</script>
