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
const selectedMenu = ref<string>(routeNameToKey(route.name?.toString() || ''));
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
  return props.sliceName ? removeIdOrSlug(name) : name;
}

function removeIdOrSlug(text) {
  return text.replace(/(-id|-slug|-archive).*/g, '');
}

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
  } else if ('beta' in option && option.beta) {
    return h(
      'span',
      h('img', {
        src: '/icons/beta.svg',
        class: 'w-14 h-5 inline-block',
        alt: 'Beta',
      })
    );
  } else if ('soon' in option && option.soon) {
    return h('span', { class: 'icon-soon align-middle text-violet text-2xl mr-2' }, '');
  }
  return null;
}

function renderMenuIcon(option: NMenuOption) {
  if ('iconName' in option) {
    return h('span', { class: iconClass(option.iconName) }, '');
  }
  return null;
}

function iconClass(iconName?: any): string {
  if (!iconName) return '';
  return iconName === 'icon-wide-right' ? `${iconName} text-yellow` : iconName;
}
</script>
