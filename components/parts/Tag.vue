<template>
  <strong
    v-bind="$attrs"
    class="inline-flex-cc rounded bg-bg-lighter/70 font-semibold transition-all duration-300"
    :class="[tagClass, sizeClass]"
  >
    <slot />
  </strong>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';

const props = defineProps({
  onHover: { type: Boolean, default: false },
  size: { type: String as PropType<Size>, default: 'medium' },
  type: { type: String as PropType<TagType>, default: 'default' },
});

const tagClass = computed(() => {
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
      return 'text-xs h-5';
    case 'small':
      return 'text-xs px-1 h-5 rounded bg-bg-lighter/70';
    case 'large':
      return 'text-lg px-4 h-8';
    default:
      return 'text-sm px-2 h-6';
  }
});
</script>
