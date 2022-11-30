<template>
  <div>
    <n-menu v-model:value="selectedPage" :options="menuOptions" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { MenuOption } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { currentRoute } = useRouter();
const NuxtLink = resolveComponent('NuxtLink');
const selectedPage = ref(currentRoute.value?.name);

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
      h(NuxtLink, { to: { name: 'dashboard-user-permissions' } }, () =>
        t('pageMenu.usersPermissions')
      ),
    key: 'dashboard-user-permissions',
  },
  {
    label: () =>
      h(NuxtLink, { to: { name: 'dashboard-credentials' } }, () => t('pageMenu.credentials')),
    key: 'dashboard-credentials',
  },
];
</script>
