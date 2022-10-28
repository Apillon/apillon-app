<template>
  <div>
    <n-menu v-model:value="selectedPage" :options="menuOptions" @update-value="handleUpdateValue" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { MenuOption } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const NuxtLink = resolveComponent('NuxtLink');
const { currentRoute } = useRouter();
const selectedPage = ref(currentRoute.value?.name);

function handleUpdateValue(key: string, item: MenuOption) {
  console.info('[onUpdate:value]: ' + JSON.stringify(key));
  console.info('[onUpdate:value]: ' + JSON.stringify(item));
}

const menuOptions: MenuOption[] = [
  {
    label: () => h(NuxtLink, { to: { path: '/methods' } }, () => $i18n.t('pageMenu.methods')),
    key: 'methods',
  },
  {
    label: () => h(NuxtLink, { to: { path: '/' } }, () => $i18n.t('pageMenu.access')),
    key: 'access',
  },
  {
    label: () => h(NuxtLink, { href: '/api-keys' }, () => $i18n.t('pageMenu.apiKeys')),
    key: 'api-keys',
  },
];
</script>
