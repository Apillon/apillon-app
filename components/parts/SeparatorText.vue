<template>
  <div v-bind="$attrs" class="my-8 flex items-center text-sm">
    <span v-if="borderLeft" class="h-[1px] w-full bg-bg-lighter"></span>
    <span class="inline-block whitespace-nowrap text-body" :class="{ 'ml-4': borderLeft, 'mr-4': borderRight }">
      <slot />
    </span>
    <span v-if="borderRight" class="h-[1px] w-full bg-bg-lighter"></span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  borderLeft: { type: Boolean, default: false },
  borderRight: { type: Boolean, default: true },
});
</script>
