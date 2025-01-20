<template>
  <div v-if="link" class="flex justify-between">
    <div>
      <span v-if="prefix" class="mr-1 text-white whitespace-nowrap">{{ prefix }}:</span>
      <a :href="link" target="_blank">
        <n-ellipsis class="align-bottom break-all" :class="color" :line-clamp="1">
          <span class="break-all" :class="{ 'text-xs': textOrLink.length > 100 }">
            {{ textOrLink }}
          </span>
          <template #tooltip>
            {{ tooltip ?? link }}
          </template>
        </n-ellipsis>
      </a>
    </div>

    <button class="ml-2" @click="copyToClipboard(textOrLink)">
      <span class="icon-copy" :class="color"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  prefix: { type: String, default: '' },
  link: { type: String, default: '' },
  text: { type: String, default: '' },
  color: { type: String, default: 'text-body' },
  tooltip: { type: String, default: undefined },
});

const textOrLink = computed(() => {
  return props.text || props.link;
});
</script>
