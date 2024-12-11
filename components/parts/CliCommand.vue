<template>
  <div v-if="command" :class="{ 'flex gap-6 items-center': list }">
    <div v-if="title" class="body-sm" :class="list ? 'w-1/3 list-item list-disc ml-4' : 'mb-2'">
      <strong>{{ title }}</strong>
      <span v-if="info" class="text-[11px]"> ({{ info }})</span>
    </div>
    <template v-if="!command.includes('null')">
      <div
        class="flex justify-between items-center card-light rounded-lg text-white pl-5 p-3"
        :class="{ 'w-2/3 ': list }"
      >
        <n-ellipsis class="align-bottom leading-normal" :line-clamp="1">
          {{ command }}
        </n-ellipsis>
        <button class="ml-2 -mt-1 -mb-3" @click="copyToClipboard(command)">
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
