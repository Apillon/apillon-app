<template>
  <div v-if="link" class="flex">
    <span v-if="prefix" class="mr-1 text-white whitespace-nowrap">{{ prefix }}:</span>
    <a :href="link" target="_blank">
      <n-ellipsis class="text-body align-bottom break-all" :line-clamp="1">
        <span class="break-all" :class="{ 'text-xs': textOrLink.length > 100 }">
          {{ textOrLink }}
        </span>
        <template #tooltip>
          {{ link }}
        </template>
      </n-ellipsis>
    </a>
    <button class="ml-2" @click="copyToClipboard(textOrLink)">
      <span class="icon-copy text-body"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  prefix: { type: String, default: '' },
  link: { type: String, default: '' },
  text: { type: String, default: '' },
});

const textOrLink = computed(() => {
  return props.text || props.link;
});
</script>
