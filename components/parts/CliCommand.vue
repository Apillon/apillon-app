<template>
  <div v-if="command">
    <div v-if="title" class="body-sm mb-2">
      <strong>{{ title }}</strong>
      <span v-if="info" class="text-[11px]"> ({{ info }})</span>
    </div>
    <template v-if="!command.includes('null')">
      <div class="flex justify-between items-center card-dark rounded-lg text-body px-4 py-2">
        <n-ellipsis class="align-bottom" :line-clamp="1">
          {{ command }}
        </n-ellipsis>
        <button class="text-body ml-2" @click="copyToClipboard(command)">
          <span class="icon-copy"></span>
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  command: { type: String, default: '' },
  title: { type: String, default: '' },
  info: { type: String, default: '' },
  copy: { type: Boolean, default: true },
});
</script>
