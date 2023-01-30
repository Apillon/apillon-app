<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : type === 'link' ? 'button' : NButton"
    v-bind="$attrs"
    :href="href || undefined"
    :to="to"
    :class="btnClass"
    :type="!href && !to ? (type === 'secondary' ? 'primary' : type) : ''"
    :size="size"
    :bordered="type === 'secondary' || type === 'error' ? true : false"
    :ghost="type === 'secondary' || type === 'error' ? true : false"
    :quaternary="quaternary || type === 'builders' ? true : false"
    @click="onClick"
  >
    <span v-if="loading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </span>
    <span :class="[innerClass, { 'opacity-0': loading }]">
      <slot />
    </span>
  </component>
</template>

<script lang="ts" setup>
const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },

  type: {
    type: String,
    validator: (value: string) =>
      ['primary', 'secondary', 'builders', 'error', 'info', 'link'].includes(value),
    default: 'primary',
  },
  size: {
    type: String,
    validator: (value: string) => ['tiny', 'small', 'medium', 'large'].includes(value),
    default: 'medium',
  },
  innerClass: { type: [String, Array, Object], default: '' },
  ridged: { type: Boolean, default: false }, // Add ridge border effect instead of solid color
  borderless: { type: Boolean, default: false },
  faded: { type: Boolean, default: false }, // greyed out
  quaternary: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);

const NuxtLink = resolveComponent('NuxtLink');
const NButton = resolveComponent('NButton');

/** Disable animation on load */
const isBtnLocked = ref<boolean>(!props.href && !props.to);
setTimeout(() => (isBtnLocked.value = false), 1000);

const btnClass = computed(() => {
  return [
    props.type === 'link' ? 'font-sans' : 'font-mono',
    {
      'w-full': props.type !== 'link' && props.size === 'large',
      'text-primary': props.type === 'link',
      'font-bold': props.type !== 'link',
      'pointer-events-none pointer-default': props.disabled || props.loading,
      'opacity-60': props.disabled,
      'hover-bounce':
        !props.href && !props.to && props.type !== 'link' && props.type !== 'builders',
      quaternary: props.quaternary || props.type === 'builders',
      locked: isBtnLocked.value,
    },
  ];
});

function onClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    emit('click', event);
  }
}
</script>
