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
    label: () => h(NuxtLink, { to: { path: '/methods' } }, () => t('pageMenu.methods')),
    key: 'methods',
  },
  {
    label: () => h(NuxtLink, { to: { path: '/' } }, () => t('pageMenu.access')),
    key: 'access',
  },
  {
    label: () => h(NuxtLink, { href: '/api-keys' }, () => t('pageMenu.apiKeys')),
    key: 'api-keys',
  },
];
</script>
