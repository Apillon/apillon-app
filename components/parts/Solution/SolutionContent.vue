<template>
  <div>
    <div v-for="(item, key) in content" :key="key">
      <h4 v-if="item.headline">{{ item.headline }}</h4>

      <h6 v-if="item.title" :class="{ 'mt-6': item.headline }">{{ item.title }}</h6>

      <ul v-if="item.content && Array.isArray(item.content)" class="list-disc pl-4 mb-4 text-body">
        <li v-for="(c, keyC) in item.content" :key="keyC">{{ c }}</li>
      </ul>
      <p v-else-if="item.content" class="mt-2 mb-6">
        {{ item.content }}
      </p>

      <ul v-if="item.benefits" class="my-6">
        <li v-for="(benefit, keyB) in item.benefits" :key="keyB" class="my-2">
          <NuxtIcon name="icon/success" class="inline-block float-left mr-2 text-2xl text-green" />
          <span>{{ benefit }}</span>
        </li>
      </ul>
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  content: { type: Array<SolutionContent>, default: [] },
});
</script>
