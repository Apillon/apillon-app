<template>
  <div v-if="link">
    <div v-if="title" class="body-sm mb-2">
      <strong>{{ title }}</strong>
    </div>
    <div v-if="copy" class="flex justify-between items-center bg-bg-dark text-body px-4 py-2">
      <n-ellipsis class="align-bottom" :line-clamp="1">
        {{ link }}
      </n-ellipsis>
      <button class="text-body ml-2" @click="copyToClipboard(link)">
        <span class="icon-copy"></span>
      </button>
    </div>
    <a v-else :href="link" target="_blank">
      <div class="flex justify-between items-center bg-bg-dark px-4 py-2">
        <n-ellipsis class="align-bottom" :line-clamp="1">
          {{ link }}
        </n-ellipsis>
        <span class="icon-preview text-xl align-middle ml-2"></span>
      </div>
    </a>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  link: { type: String, default: '' },
  title: { type: String, default: '' },
  copy: { type: Boolean, default: false },
});
</script>
