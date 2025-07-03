<template>
  <NuxtIcon
    name="animation/status"
    class="animation-spinning inline-flex-cc"
    filled
    :style="{ width: `${size}px`, height: `${size}px` }"
  />
</template>

<script lang="ts" setup>
defineProps({
  size: { type: Number, default: 12 },
});
</script>
