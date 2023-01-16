<template>
  <Menu :options="menuOptions" />
</template>

<script lang="ts" setup>
import { h } from 'vue';

const { t } = useI18n();
const NuxtLink = resolveComponent('NuxtLink');

const menuOptions: NMenuOption[] = [
  {
    label: () => h(NuxtLink, { to: { name: 'dashboard-methods' } }, () => t('pageMenu.methods')),
    key: 'dashboard-methods',
  },
  {
    label: () => h(NuxtLink, { to: { path: '/dashboard' } }, () => t('pageMenu.access')),
    key: 'dashboard-access',
  },
  {
    label: () => h(NuxtLink, { to: { name: 'dashboard-api-keys' } }, () => t('pageMenu.apiKeys')),
    key: 'dashboard-api-keys',
  },
];
</script>
