<template>
  <div v-if="link" class="flex justify-between text-body">
    <div>
      <span v-if="prefix" class="mr-1 whitespace-nowrap text-white">{{ prefix }}:</span>
      <a :href="link" target="_blank">
        <n-ellipsis class="break-all align-bottom text-blue underline" :class="color" :line-clamp="1">
          <span class="break-all" :class="{ 'text-xs': textOrLink.length > 100 }">
            {{ textOrLink }}
          </span>
          <template #tooltip>
            {{ tooltip ?? link }}
          </template>
        </n-ellipsis>
      </a>
    </div>

    <button class="ml-2" @click="copyToClipboard(link)">
      <span class="icon-copy text-white-primary" :class="color"></span>
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  prefix: { type: String, default: '' },
  link: { type: String, default: '' },
  text: { type: String, default: '' },
  color: { type: String, default: '' },
  tooltip: { type: String, default: undefined },
});

const textOrLink = computed(() => {
  return props.text || props.link;
});
</script>
