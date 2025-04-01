<template>
  <div v-if="link">
    <div v-if="title" class="body-sm mb-2">
      <strong>{{ title }}</strong>
      <span v-if="info" class="text-[11px]"> ({{ info }})</span>
    </div>
    <template v-if="!link.includes('null')">
      <div v-if="copy" class="card-dark flex items-center justify-between rounded-lg px-4 py-2 text-body">
        <n-ellipsis class="align-bottom" :line-clamp="1">
          <a :href="link" target="_blank">
            {{ link }}
          </a>
        </n-ellipsis>
        <button class="ml-2 text-body" @click="copyToClipboard(link)">
          <span class="icon-copy"></span>
        </button>
      </div>
      <a v-else :href="link" target="_blank">
        <div class="card-dark flex items-center justify-between rounded-lg px-4 py-2">
          <n-ellipsis class="align-bottom" :line-clamp="1">
            {{ link }}
          </n-ellipsis>
          <span class="icon-preview ml-2 align-middle text-xl"></span>
        </div>
      </a>
    </template>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  link: { type: String, default: '' },
  title: { type: String, default: '' },
  info: { type: String, default: '' },
  copy: { type: Boolean, default: false },
});
</script>
