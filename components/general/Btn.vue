<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : type === 'link' ? 'button' : NButton"
    v-bind="$attrs"
    :href="href || undefined"
    :to="to"
    :class="btnClass"
    :type="!href && !to ? 'primary' : ''"
    :size="size"
    :ghost="type === 'secondary' ? true : false"
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
    validator: (value: string) => ['primary', 'secondary', 'link'].includes(value),
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
});
const emit = defineEmits(['click']);

const NuxtLink = resolveComponent('NuxtLink');
const NButton = resolveComponent('NButton');

/** Disable animation on load */
const isBtnLocked = ref<boolean>(!props.href && !props.to);
setTimeout(() => (isBtnLocked.value = false), 1000);

const btnClass = computed(() => {
  return [
    props.type === 'link' ? 'font-content' : 'font-button',
    {
      'py-[10px] px-6': props.type !== 'link' && props.size === 'small',
      'py-4 px-10': props.type !== 'link' && props.size === 'medium',
      'py-4 px-2 w-full': props.type !== 'link' && props.size === 'large',
      'text-primary': props.type === 'link',
      'font-bold': props.type !== 'link',
      'pointer-events-none pointer-default': props.disabled || props.loading,
      'opacity-60': props.disabled,
      'hover-bounce': !props.href && !props.to && props.type !== 'link',
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
