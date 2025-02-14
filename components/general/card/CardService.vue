<template>
  <div class="card-dark flex flex-col justify-between p-8">
    <div class="flex items-center justify-between text-white">
      <strong>{{ name }}</strong>
      <NuxtLink
        v-if="link"
        :to="{ name: link }"
        class="inline-flex-cc h-10 w-10 rounded-full transition-colors duration-300 hover:bg-bg-lighter"
      >
        <span class="icon-wide-right text-xl"></span>
      </NuxtLink>
    </div>
    <div class="mt-2">
      <p>{{ description }}</p>
    </div>
    <div v-if="tags" class="mt-2 flex flex-wrap gap-2">
      <Tag v-for="(item, key) in tags" :key="key" size="small" :type="item.includes('No code') ? 'success' : 'default'">
        {{ item }}
      </Tag>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  iconSvg: { type: String, default: null },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  tags: { type: Array<String>, default: null },
});
</script>
