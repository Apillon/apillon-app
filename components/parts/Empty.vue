<template>
  <div
    class="flex flex-col items-center justify-center px-6 py-4"
    style="min-height: calc(100vh - 270px)"
  >
    <div v-if="icon" class="mb-4">
      <NuxtIcon :name="icon" class="icon-auto" filled />
    </div>
    <div class="mb-10 text-center">
      <h3 v-if="title" class="font-bold">{{ title }}</h3>
      <p v-if="info" class="text-body">{{ info }}</p>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: { type: String, required: false },
  info: { type: String, required: false },
  icon: { type: String, required: false },
});
</script>
