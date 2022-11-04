<template>
  <div>
    <n-menu v-model:value="selectedPage" :options="menuOptions" @update-value="handleUpdateValue" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { MenuOption } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const NuxtLink = resolveComponent('NuxtLink');
const { currentRoute } = useRouter();
const selectedPage = ref(currentRoute.value?.name);

function handleUpdateValue(key: string, item: MenuOption) {
  console.info('[onUpdate:value]: ' + JSON.stringify(key));
  console.info('[onUpdate:value]: ' + JSON.stringify(item));
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(NuxtLink, { to: { path: 'project-settings' } }, () => t('pageMenu.projectSettings')),
    key: 'project-settings',
  },
  {
    label: () =>
      h(NuxtLink, { to: { path: 'user-permissions' } }, () => t('pageMenu.usersPermissions')),
    key: 'user-permissions',
  },
  {
    label: () => h(NuxtLink, { href: 'credentials' }, () => t('pageMenu.credentials')),
    key: 'credentials',
  },
];
</script>
