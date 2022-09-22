<script lang="ts" setup>
const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },

  innerClass: { type: [String, Array, Object], default: '' },
  large: { type: Boolean, default: false },
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
    {
      'pointer-events-none pointer-default': props.disabled || props.loading,
      'opacity-60': props.disabled,

      [$style.large]: props.large,
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

<style lang="postcss" module>
.btn {
  @apply relative inline-block font-serif font-normal text-lg text-white;

  .inner {
    @apply px-2;
  }
}
</style>
