<template>
  <div v-bind="$attrs" class="my-10 flex items-center text-sm">
    <span v-if="borderLeft" class="bg-bg-lighter h-[1px] w-full"></span>
    <span
      class="inline-block text-body whitespace-nowrap"
      :class="{ 'ml-4': borderLeft, 'mr-4': borderRight }"
    >
      <slot />
    </span>
    <span v-if="borderRight" class="bg-bg-lighter h-[1px] w-full"></span>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  borderLeft: { type: Boolean, default: false },
  borderRight: { type: Boolean, default: true },
});
</script>
