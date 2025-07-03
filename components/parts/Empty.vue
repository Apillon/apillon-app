<template>
  <div
    class="mx-auto flex flex-col items-center justify-center px-6 py-4 md:max-w-2xl"
    :style="small ? {} : { minHeight: 'calc(100dvh - 270px)' }"
  >
    <div v-if="icon" class="mb-8">
      <NuxtIcon :name="icon" class="icon-auto w-full max-w-xs" filled />
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
defineProps({
  title: { type: String, default: '' },
  info: { type: String, default: '' },
  icon: { type: String, default: '' },
  small: { type: Boolean, default: false },
});
</script>
