<template>
  <div class="flex" v-if="link">
    <a :href="link" target="_blank">
      <NEllipsis class="text-body align-bottom" :line-clamp="1">
        {{ linkOrText }}
        <template #tooltip>
          {{ link }}
        </template>
      </NEllipsis>
    </a>
    <button class="ml-2" @click="copyToClipboard(link)">
      <span class="icon-copy text-body"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  link: { type: String, default: '' },
  text: { type: String, default: '' },
});

const linkOrText = computed(() => {
  return props.text || props.link;
});
</script>
