<template>
  <div v-if="text" class="flex">
    <span v-if="prefix" class="mr-1 text-white whitespace-nowrap">{{ prefix }}:</span>
    <n-ellipsis class="break-all text-body align-bottom" :line-clamp="1">{{ text }}</n-ellipsis>
    <button class="ml-2" @click="copyToClipboard(text)">
      <span class="icon-copy text-body"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  prefix: { type: String, default: '' },
  text: { type: String, default: '' },
});
</script>
