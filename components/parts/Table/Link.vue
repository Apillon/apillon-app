<template>
  <div v-if="link" class="flex">
    <a :href="link" target="_blank">
      <NEllipsis class="text-body align-bottom" :line-clamp="1">
        {{ textOrLink }}
        <template #tooltip>
          {{ link }}
        </template>
      </NEllipsis>
    </a>
    <button class="ml-2" @click="copyToClipboard(textOrLink)">
      <span class="icon-copy text-body"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  link: { type: String, default: '' },
  text: { type: String, default: '' },
});

const textOrLink = computed(() => {
  return props.text || props.link;
});
</script>
