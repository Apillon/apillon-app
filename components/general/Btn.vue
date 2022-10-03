<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : 'button'"
    v-bind="$attrs"
    :href="href || undefined"
    :to="to"
    :class="btnClass"
    @click="onClick"
  >
    <span :class="[$style.inner, innerClass]">
      <Spinner v-if="loading" />
      <slot v-else />
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
      ['primary', 'secondary', 'outline-primary', 'outline-secondary', 'link'].includes(value),
    default: 'primary',
  },
  size: {
    type: String,
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value),
    default: 'md',
  },
  innerClass: { type: [String, Array, Object], default: '' },
  ridged: { type: Boolean, default: false }, // Add ridge border effect instead of solid color
  borderless: { type: Boolean, default: false },
  faded: { type: Boolean, default: false }, // greyed out
});
const emit = defineEmits(['click']);

const NuxtLink = resolveComponent('NuxtLink');
const $style = useCssModule();

const btnClass = computed(() => {
  return [
    $style.btn,
    $style[props.size],
    $style[props.type],
    {
      'pointer-events-none pointer-default': props.disabled || props.loading,
      'opacity-60': props.disabled,

      [$style.borderless]: props.borderless,
      [$style.ridge]: props.ridged,
      [$style.faded]: props.faded,
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

<style lang="postcss" module>
.btn {
  @apply relative inline-block font-content font-bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &.sm {
    @apply px-3 py-[7px];
  }
  &.md {
    @apply px-5 py-[17px];
  }
  &.lg {
    @apply p-[22px];
  }

  &.primary {
    @apply text-white bg-purple rounded;
    &:active {
      @apply bg-purple-dark;
    }
    &:focus,
    &:hover {
      @apply bg-purple-light;
    }
  }
  &.secondary {
    @apply text-white bg-pink rounded;
    &:active {
      @apply bg-pink-dark;
    }
    &:focus,
    &:hover {
      @apply bg-pink-light;
    }
  }
  &.outline-primary {
    @apply text-grey-bright bg-transparent border-[1px] border-purple rounded;

    &:hover {
      @apply text-white bg-purple-light;
    }
  }
  &.outline-secondary {
    @apply text-grey-bright bg-transparent border-[1px] border-pink rounded;
  }

  .inner {
    @apply px-2;
  }
}
</style>
