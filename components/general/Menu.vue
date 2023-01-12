<template>
  <div>
    <n-menu
      v-bind="$attrs"
      v-model:value="selectedMenu"
      :render-icon="renderMenuIcon"
      :render-label="renderMenuLabel"
      :render-extra="renderMenuExtra"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
const { name } = useRoute();
const selectedMenu = ref(name?.toString() || '');
const NuxtLink = resolveComponent('NuxtLink');

/**
 * Render functions
 */
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

function renderMenuExtra(option: NMenuOption) {
  if ('new' in option) {
    return h('span', { class: 'icon-new align-middle text-blue text-2xl' }, '');
  } else if ('soon' in option) {
    return h('span', { class: 'icon-soon align-middle text-violet text-2xl mr-2' }, '');
  }
  return null;
}

function renderMenuIcon(option: NMenuOption) {
  if ('iconName' in option) {
    return h('span', { class: option.iconName }, '');
  }
  return null;
}
</script>
