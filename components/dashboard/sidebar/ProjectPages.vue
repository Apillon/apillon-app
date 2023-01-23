<template>
  <div>
    <n-menu v-model:value="selectedPage" :options="menuOptions" @update-value="handleUpdateValue" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { MenuOption } from 'naive-ui';

const { t } = useI18n();
const { name } = useRoute();
const selectedPage = ref<string>(name?.toString() || '');
const NuxtLink = resolveComponent('NuxtLink');

function handleUpdateValue(key: string, item: MenuOption) {
  console.info('[onUpdate:value]: ' + JSON.stringify(key));
  console.info('[onUpdate:value]: ' + JSON.stringify(item));
}

const menuOptions: MenuOption[] = [
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
