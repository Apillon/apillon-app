<template>
  <div>
    <n-menu v-model:value="selectedPage" :options="menuOptions" :render-label="renderMenuLabel" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';

const { t } = useI18n();
const { name } = useRoute();
const selectedPage = ref(name?.toString() || '');
const NuxtLink = resolveComponent('NuxtLink');

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

function renderMenuLabel(option: NMenuOption) {
  if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, () => option.label as string);
  } else if ('path' in option) {
    return h(NuxtLink, { to: { path: option.path } }, () => option.label as string);
  } else if ('to' in option) {
    return h(NuxtLink, { to: { name: option.to } }, () => option.label as string);
  }
  return h('span', { class: 'text' }, { default: () => option.label as string });
}
</script>
