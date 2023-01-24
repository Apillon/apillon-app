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
const props = defineProps({
  sliceName: { type: Boolean, default: false },
});
const route = useRoute();
const { name } = useRoute();
const selectedMenu = ref<string>(routeNameToKey(name?.toString() || ''));
const NuxtLink = resolveComponent('NuxtLink');

/** Watch route name and refresh selected menu item */
const routeName = computed(() => {
  return route.name?.toString() || '';
});
watch(
  () => routeName.value,
  routeName => {
    selectedMenu.value = routeNameToKey(routeName?.toString() || '');
  }
);

function routeNameToKey(name: string) {
  return props.sliceName ? name.split('-').slice(0, 3).join('-') : name;
}

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
