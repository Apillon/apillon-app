<template>
  <div v-if="command" :class="{ 'flex items-center gap-6': list }">
    <div v-if="title" class="body-sm" :class="list ? 'ml-4 list-item w-1/3 list-disc' : 'mb-2'">
      <strong>{{ title }}</strong>
      <span v-if="info" class="text-[11px]"> ({{ info }})</span>
    </div>
    <template v-if="!command.includes('null')">
      <div
        class="card-light flex items-center justify-between rounded-lg p-3 pl-5 text-white"
        :class="{ 'w-2/3': list }"
      >
        <n-ellipsis class="align-bottom leading-normal" :line-clamp="1">
          {{ command }}
        </n-ellipsis>
        <button class="-mb-3 -mt-1 ml-2" @click="copyToClipboard(command)">
          <span class="icon-copy text-2xl"></span>
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
  list: { type: Boolean, default: false },
});
</script>
