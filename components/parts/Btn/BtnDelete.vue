<template>
  <n-button
    :class="[
      { 'h-6 w-6 !p-0': size === 'tiny' },
      { 'h-8 w-8 !p-1': size === 'small' },
      { 'h-9 w-9 !p-1': size === 'medium' },
      { 'h-10 w-10 !p-2': size === 'large' },
    ]"
    type="error"
    ghost
  >
    <span
      class="icon-delete"
      :class="[
        { 'text-sm': size === 'tiny' },
        { 'text-base': size === 'small' },
        { 'text-lg': size === 'medium' },
        { 'text-xl': size === 'large' },
      ]"
    ></span>
  </n-button>
</template>

<script lang="ts" setup>
import type { Size } from 'naive-ui/es/button/src/interface';

defineProps({
  size: { type: String as PropType<Size>, default: 'medium' },
});
</script>
