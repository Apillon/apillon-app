<template>
  <div class="card-light p-4">
    <div class="flex-cc mx-auto h-12 w-12">
      <NuxtIcon name="icon/image" class="text-2xl" filled />
    </div>
    <div class="flex flex-col items-center gap-3">
      <h6>{{ title }}</h6>
      <small>{{ info }}</small>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, default: '' },
  info: { type: String, default: '' },
});
</script>
