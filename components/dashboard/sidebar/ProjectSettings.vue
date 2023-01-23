<template>
  <div>
    <n-menu v-model:value="selectedPage" :options="menuOptions" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { MenuOption } from 'naive-ui';

const { t } = useI18n();
const { name } = useRoute();
const selectedPage = ref(name?.toString() || '');
const NuxtLink = resolveComponent('NuxtLink');

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(NuxtLink, { to: { name: 'dashboard-project-settings' } }, () =>
        t('pageMenu.projectSettings')
      ),
    key: 'dashboard-project-settings',
  },
  {
    label: () =>
      h(NuxtLink, { to: { name: 'dashboard-users-permissions' } }, () =>
        t('pageMenu.usersPermissions')
      ),
    key: 'dashboard-users-permissions',
  },
  {
    label: () => h(NuxtLink, { to: { name: 'dashboard-api-keys' } }, () => t('pageMenu.apiKeys')),
    key: 'dashboard-api-keys',
  },
];
</script>
