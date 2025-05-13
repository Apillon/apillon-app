<template>
  <n-tag
    v-bind="$attrs"
    class="rounded-xl text-[10px] uppercase"
    :class="[{ 'bg-green': type === 'success' }, { 'bg-orange': type === 'warning' }, { 'bg-pink': type === 'error' }]"
    :size="size"
    :type="type"
    round
  >
    <slot />
  </n-tag>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/select/src/interface';

defineProps({
  type: { type: String as PropType<TagType>, default: 'default' },
  size: { type: String as PropType<Size>, default: 'small' },
});
</script>
