<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const websiteStore = useWebsiteStore();

const props = defineProps({
  hasGithubConnected: {
    type: Boolean,
    default: false,
  },
});

const menuOptions: NMenuOption[] = [
  ...(props.hasGithubConnected
    ? [
        {
          key: 'dashboard-service-hosting-slug-deployments',
          label: t('hosting.menu.deployments'),
          path: `/dashboard/service/hosting/${websiteStore.selected}/deployments`,
        },
      ]
    : []),
  {
    key: 'dashboard-service-hosting-id',
    label: t('hosting.menu.preview'),
    path: `/dashboard/service/hosting/${websiteStore.selected}`,
  },
  {
    key: 'dashboard-service-hosting-slug-staging',
    label: t('hosting.menu.staging'),
    path: `/dashboard/service/hosting/${websiteStore.selected}/staging`,
  },
  {
    key: 'dashboard-service-hosting-slug-production',
    label: t('hosting.menu.production'),
    path: `/dashboard/service/hosting/${websiteStore.selected}/production`,
  },
];
</script>
