<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : NButton"
    v-bind="$attrs"
    :href="href || undefined"
    :to="to"
    :class="btnClass"
    :type="!href && !to ? 'primary' : ''"
    :ghost="btnType === 'secondary'"
    @click="onClick"
  >
    <span :class="[$style.inner, innerClass]">
      <Spinner v-if="loading" />
      <slot v-else />
    </span>
  </component>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';

const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },

  btnType: {
    type: String,
    validator: (value: string) => ['primary', 'secondary', 'link'].includes(value),
    default: 'link',
  },
  size: {
    type: String,
    validator: (value: string) => ['tiny', 'sm', 'md'].includes(value),
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
    @apply px-[10px] py-6;
  }
  &.md {
    @apply px-4 py-10;
  }

  .inner {
    @apply px-2;
  }
}
</style>
