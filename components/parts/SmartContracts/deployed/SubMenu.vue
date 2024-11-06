<template>
  <div>
    <n-menu
      v-model:value="selectedMenu"
      :options="menuOptions"
      :render-label="renderMenuLabel"
      :render-extra="renderMenuExtra"
      mode="horizontal"
    />
  </div>
  <component :is="currentComponent" name="name" />
</template>

<script lang="ts" setup>
import Functions from './Functions.vue';
import Events from './Events.vue';
// Define menu options
const menuOptions = [
  { label: 'Functions', key: 'functions' },
  { label: 'Events', key: 'events' },
];
const selectedMenu = ref<string>('functions');
const NuxtLink = resolveComponent('NuxtLink');

// Resolve components based on the selected menu item
const currentComponent = computed(() => {
  switch (selectedMenu.value) {
    case 'functions':
      return Functions;
    case 'events':
      return Events;
    default:
      return null;
  }
});

/**
 * Render functions
 */
function renderMenuLabel(option: NMenuOption) {
  const colorClass = option.iconName === 'icon-wide-right' ? '!text-yellow' : '';

  if ('disabled' in option && option.disabled) {
    return h('span', { class: 'text-body' }, { default: () => option.label as string });
  } else if ('href' in option) {
    return h(
      'a',
      { href: option.href, class: colorClass, target: '_blank' },
      () => option.label as string
    );
  } else if ('path' in option) {
    return h(
      NuxtLink,
      { to: { path: option.path }, class: colorClass },
      () => option.label as string
    );
  } else if ('to' in option) {
    return h(
      NuxtLink,
      { to: { name: option.to }, class: colorClass },
      () => option.label as string
    );
  }
  return h('span', { class: 'text' }, { default: () => option.label as string });
}

function renderMenuExtra(option: NMenuOption) {
  if ('new' in option && option.new) {
    return h('span', { class: 'icon-new align-middle text-blue text-2xl' }, '');
  } else if ('soon' in option && option.soon) {
    return h('span', { class: 'icon-soon align-middle text-violet text-2xl mr-2' }, '');
  }
  return null;
}
</script>
