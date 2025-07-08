<template>
  <strong
    v-bind="$attrs"
    class="inline-flex-cc min-w-5 gap-1 whitespace-nowrap bg-bg-lighter/70 font-semibold transition-all duration-300"
    :class="[tagClass, sizeClass]"
  >
    <AnimationStatus v-if="animation" />
    <slot />
  </strong>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';

const props = defineProps({
  animation: { type: Boolean, default: false },
  filled: { type: Boolean, default: false },
  onHover: { type: Boolean, default: false },
  size: { type: String as PropType<Size>, default: 'small' },
  type: { type: String as PropType<TagType>, default: 'default' },
});

const tagClass = computed(() => {
  if (props.filled) {
    switch (props.type) {
      case 'warning':
        return 'bg-yellow text-bg-dark';
      case 'success':
        return 'bg-green text-bg-dark';
      case 'error':
        return 'bg-pink text-bg-dark';
      case 'primary':
        return 'bg-violet text-bg-dark';
      case 'info':
        return 'bg-blue text-bg-dark';
      default:
        return 'bg-bg-lighter/70 text-bg-dark';
    }
  }
  if (props.onHover) {
    switch (props.type) {
      case 'warning':
        return 'text-yellow hover:bg-yellow hover:text-bg-dark';
      case 'success':
        return 'text-green hover:bg-green hover:text-bg-dark';
      case 'error':
        return 'text-pink hover:bg-pink hover:text-bg-dark';
      case 'primary':
        return 'text-violet hover:bg-violet hover:text-bg-dark';
      case 'info':
        return 'text-blue hover:bg-blue hover:text-bg-dark';
      default:
        return 'text-white hover:bg-blue hover:text-bg-dark';
    }
  }
  switch (props.type) {
    case 'warning':
      return 'text-yellow';
    case 'success':
      return 'text-green';
    case 'error':
      return ' text-pink';
    case 'primary':
      return 'text-violet';
    case 'info':
      return 'text-blue';
    default:
      return 'text-white';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'tiny':
      return 'text-[10px] px-1 h-5 rounded';
    case 'small':
      return 'text-xs px-[6px] h-5 rounded-md';
    case 'large':
      return 'text-lg px-4 h-8 rounded-xl';
    default:
      return 'text-sm px-2 h-6 rounded-lg';
  }
});
</script>
