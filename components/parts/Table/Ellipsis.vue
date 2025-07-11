<template>
  <div v-if="text" class="flex">
    <span v-if="prefix" class="mr-1 whitespace-nowrap text-white">{{ prefix }}:</span>
    <n-ellipsis class="break-all align-bottom" :class="color" :line-clamp="1">
      {{ text }}
    </n-ellipsis>
    <button v-if="copy" class="ml-2" @click="copyToClipboard(text)">
      <span class="icon-copy text-white-primary" :class="color"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  prefix: { type: String, default: '' },
  text: { type: String, default: '' },
  color: { type: String, default: 'text-body' },
  textWhite: { type: Boolean, default: false },
  copy: { type: Boolean, default: true },
});
</script>
