<template>
  <n-tag
    v-bind="$attrs"
    class="rounded-xl uppercase text-[10px]"
    :class="[
      { 'bg-green': type === 'success' },
      { 'bg-orange': type === 'warning' },
      { 'bg-pink': type === 'error' },
    ]"
    :size="size"
    :type="type"
    round
  >
    <slot />
  </n-tag>
</template>

<script lang="ts" setup>
export type TagType = 'default' | 'error' | 'primary' | 'info' | 'success' | 'warning';
type TagSize = 'small' | 'medium' | 'large' | 'tiny';

defineProps({
  type: {
    type: String as PropType<TagType>,
    default: 'default',
  },
  size: {
    type: String as PropType<TagSize>,
    default: 'small',
  },
});
</script>
