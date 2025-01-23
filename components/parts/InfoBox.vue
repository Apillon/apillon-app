<template>
  <div class="flex p-2 border border-bg-lighter">
    <span class="icon-info mt-1"></span>
    <p class="ml-2 whitespace-break-spaces">
      {{ content }}
    </p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  content: { type: String, default: '' },
});
</script>
