<template>
  <div>
    <n-menu v-model:value="selectedPage" :options="menuOptions" @update-value="handleUpdateValue" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { NMenu } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const $i18n = useI18n();
const { currentRoute } = useRouter();
const selectedPage = ref(currentRoute.value?.name);

function handleUpdateValue(key: string, item: MenuOption) {
  console.info('[onUpdate:value]: ' + JSON.stringify(key));
  console.info('[onUpdate:value]: ' + JSON.stringify(item));
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        'a',
        {
          href: '/methods',
          rel: 'noopenner noreferrer',
        },
        $i18n.t('pageMenu.methods')
      ),
    key: 'methods',
  },
  {
    label: () =>
      h(
        'a',
        {
          href: '/access',
          rel: 'noopenner noreferrer',
        },
        $i18n.t('pageMenu.access')
      ),
    key: 'access',
  },
  {
    label: () =>
      h(
        'a',
        {
          href: '/api-keys',
          rel: 'noopenner noreferrer',
        },
        $i18n.t('pageMenu.apiKeys')
      ),
    key: 'api-keys',
  },
  // {
  //   label: () =>
  //     h(
  //       NuxtLink,
  //       {
  //         // href: 'https://en.wikipedia.org/wiki/Hear_the_Wind_Sing',
  //         to: {
  //           path: '/api-keys',
  //         },
  //       },
  //       'pageMenu.apiKeys'
  //     ),
  //   key: 'api-keys',
  // },
];
</script>
