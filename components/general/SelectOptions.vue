<template>
  <n-select v-bind="$attrs">
    <template #arrow>
      <span class="icon-down text-3xl"></span>
    </template>
  </n-select>
</template>

<script lang="ts" setup>
import { passiveSupport } from 'passive-events-support/src/utils';
passiveSupport({
  debug: false,
  listeners: [
    {
      element: 'div.n-virtual-list.v-vl',
      event: 'wheel',
    },
  ],
});
</script>
