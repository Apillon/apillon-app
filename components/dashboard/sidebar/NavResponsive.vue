<template>
  <n-menu
    v-model:value="selectedMenu"
    :value="selectedMenu"
    :default-value="selectedMenu"
    :inverted="true"
    :root-indent="32"
    :indent="0"
    :collapsed-width="32"
    :icon-size="20"
    :collapsed-icon-size="24"
    :options="menuOptions"
    :render-label="renderMenuLabel"
  />
</template>

<script lang="ts" setup>
import { Key } from 'naive-ui/es/menu/src/interface';
import { VNode } from 'vue';

const $i18n = useI18n();
const emit = defineEmits(['toggleSidebar']);
const NuxtLink = resolveComponent('NuxtLink');

const { name } = useRoute();
const selectedMenu = ref<Key>(name?.toString() || '');
console.log(selectedMenu.value);

const menuOptions: NMenuMixedOption[] = [
  {
    key: 'project-overview',
    label: $i18n.t('nav.projectOverview'),
    to: 'dashboard',
    icon: renderIcon('icon-home'),
    disabled: !isFeatureEnabled(Feature.PROJECT),
  },
  {
    type: 'group',
    label: $i18n.t('nav.services'),
    key: 'services',
    children: [
      {
        key: 'authentication',
        label: $i18n.t('nav.authentication'),
        to: 'dashboard-service-authentication',
        icon: renderIcon('icon-authentication'),
        disabled: !isFeatureEnabled(Feature.AUTHENTICATION),
      },
      {
        key: 'storage',
        label: $i18n.t('nav.storage'),
        to: 'dashboard-service-storage',
        icon: renderIcon('icon-storage'),
        disabled: !isFeatureEnabled(Feature.STORAGE),
      },
      {
        key: 'computing',
        label: $i18n.t('nav.computing'),
        icon: renderIcon('icon-computing'),
        soon: !isFeatureEnabled(Feature.COMPUTING),
        disabled: !isFeatureEnabled(Feature.COMPUTING),
      },
    ],
  },
  {
    type: 'group',
    label: $i18n.t('nav.monitoring'),
    key: 'monitoring',
    children: [
      {
        key: 'analytics',
        label: $i18n.t('nav.analytics'),
        icon: renderIcon('icon-analytics'),
        disabled: !isFeatureEnabled(Feature.MONITORING),
      },
      {
        key: 'service-monitor',
        label: $i18n.t('nav.serviceMonitor'),
        icon: renderIcon('icon-service-monitor'),
        disabled: !isFeatureEnabled(Feature.MONITORING),
      },
    ],
  },
  {
    type: 'group',
    label: $i18n.t('nav.configuration'),
    key: 'configuration',
    children: [
      {
        key: 'project-settings',
        label: $i18n.t('nav.projectSettings'),
        to: 'dashboard-project-settings',
        icon: renderIcon('icon-project-setting'),
        disabled: !isFeatureEnabled(Feature.PROJECT_SETTINGS),
      },
      {
        key: 'access',
        label: $i18n.t('nav.access'),
        icon: renderIcon('icon-acess'),
        disabled: !isFeatureEnabled(Feature.ACCESS),
      },
      {
        key: 'billing',
        label: $i18n.t('nav.billing'),
        to: 'dashboard-billing',
        icon: renderIcon('icon-billing'),
        disabled: !isFeatureEnabled(Feature.BILLING),
      },
    ],
  },
];

function renderMenuLabel(option: NMenuOption) {
  const additionalIcon = ref<VNode<VueRendererNode, VueRendererElement, { [key: string]: any }>>();
  if ('new' in option) {
    additionalIcon.value = h('span', { class: 'icon-new float-right text-blue text-2xl' }, '');
  } else if ('soon' in option) {
    additionalIcon.value = h(
      'span',
      { class: 'icon-soon float-right text-violet text-2xl mr-2' },
      ''
    );
  }

  const link = ref<VNode<VueRendererNode, VueRendererElement, { [key: string]: any }>>();
  if ('href' in option) {
    link.value = h('a', { href: option.href, target: '_blank' }, () => option.label as string);
  } else if ('path' in option) {
    link.value = h(NuxtLink, { to: { path: option.path } }, () => option.label as string);
  } else if ('to' in option) {
    link.value = h(NuxtLink, { to: { name: option.to } }, () => option.label as string);
  } else {
    link.value = h('span', { class: 'text' }, { default: () => option.label as string });
  }
  return [additionalIcon.value, link.value];
}

function renderIcon(icon: string) {
  return () => h('span', { class: icon }, '');
}
</script>

<style lang="postcss"></style>
