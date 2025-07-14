<template>
  <component
    :is="href ? 'a' : to ? NuxtLink : type === 'link' ? 'button' : NButton"
    v-if="type === 'link' || (!to && !href)"
    v-bind="$attrs"
    :to="to || undefined"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :class="btnClass"
    :type="!href && !to ? (type === 'secondary' ? 'tertiary' : type) : ''"
    :size="size"
    :disabled="disabled"
    :bordered="type === 'secondary' || type === 'error' ? true : false"
    :ghost="type === 'secondary' || type === 'error' ? true : false"
    :quaternary="quaternary || type === 'builders' ? true : false"
    @click="onClick"
  >
    <AnimationStatus v-if="loading && disabled" class="-ml-6 mr-2" :size="size === 'large' ? 24 : 18" />
    <span v-else-if="loading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner :size="size === 'large' ? 36 : 24" />
    </span>
    <span :class="[innerClass, loading && disabled ? 'opacity-60' : loading ? 'opacity-0' : '']">
      <slot />
    </span>
  </component>
  <component
    :is="to ? NuxtLink : 'a'"
    v-else
    class="inline-block"
    :class="[
      { 'w-full': size === 'large' },
      { 'pointer-default pointer-events-none': props.disabled || props.loading },
    ]"
    :to="props.disabled || props.loading || !to ? undefined : to"
    :href="props.disabled || props.loading || !href ? undefined : href"
    :target="href ? '_blank' : undefined"
  >
    <n-button
      v-bind="$attrs"
      :class="btnClass"
      :type="type === 'secondary' ? 'tertiary' : (type as NButtonType)"
      :size="size"
      :disabled="disabled"
      :bordered="type === 'secondary' || type === 'error'"
      :ghost="type === 'secondary' || type === 'error'"
      :quaternary="quaternary || type === 'builders'"
      @click="onClick"
    >
      <AnimationStatus v-if="loading && disabled" :size="size === 'large' ? 24 : 18" />
      <span v-else-if="loading" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Spinner :size="size === 'large' ? 36 : 24" />
      </span>
      <span :class="[innerClass, loading && disabled ? 'opacity-60' : loading ? 'opacity-0' : '']">
        <slot />
      </span>
    </n-button>
  </component>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import type { Type as NButtonType, Size as ButtonSize } from 'naive-ui/es/button/src/interface';

export type ButtonType = NButtonType | 'secondary' | 'builders' | 'link' | 'text';

const props = defineProps({
  href: { type: String, default: null },
  to: { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  type: { type: String as PropType<ButtonType>, default: 'primary' },
  size: { type: String as PropType<ButtonSize>, default: 'medium' },
  innerClass: { type: [String, Array, Object], default: '' },
  ridged: { type: Boolean, default: false }, // Add ridge border effect instead of solid color
  borderless: { type: Boolean, default: false },
  faded: { type: Boolean, default: false }, // greyed out
  quaternary: { type: Boolean, default: false },
});
const emit = defineEmits(['click']);

const NuxtLink = resolveComponent('NuxtLink');

/** Disable animation on load */
const isBtnLocked = ref<boolean>(!props.href && !props.to);
setTimeout(() => (isBtnLocked.value = false), 1000);

const btnClass = computed(() => {
  return [
    {
      'w-full': props.type !== 'link' && props.size === 'large',
      'min-w-40': ['primary', 'secondary'].includes(props.type) && props.size === 'small',
      'underline transition-colors duration-300 hover:text-primary': props.type === 'link',
      'font-bold': props.type !== 'link',
      'pointer-events-none pointer-default': props.disabled || props.loading,
      'opacity-60 !text-disabled hover:!text-disabled': props.disabled,
      'border-lighter': props.type == 'secondary',
      'text-yellow hover:!text-yellow hover:underline': props.type == 'text',
      'text-yellow font-semibold locked': props.type == 'tertiary',
      'hover-bounce': !['link', 'builders', 'text'].includes(props.type),
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
