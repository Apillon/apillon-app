<template>
  <Menu :options="menuOptions" mode="horizontal" />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();

const menuOptions: NMenuOption[] = [
  {
    key: 'dashboard-payments',
    label: t('dashboard.pageMenu.payments'),
    to: 'dashboard-payments',
  },
  {
    key: 'dashboard-billing',
    label: t('dashboard.pageMenu.credits'),
    to: 'dashboard-billing',
  },
  {
    key: 'dashboard-price-list',
    label: t('dashboard.pageMenu.priceList'),
    to: 'dashboard-price-list',
  },
];

onMounted(async () => {
  await dataStore.waitOnPromises();
  if (!dataStore.hasProjects || dataStore.isProjectUser) {
    router.push({ name: 'dashboard' });
  }
});
</script>
