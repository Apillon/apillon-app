<template>
  <div class="mb-8">
    <h4 v-if="headline" class="mb-2">{{ headline }}</h4>
    <h5 v-else-if="title" class="mb-2">{{ title }}</h5>
    <p v-if="content">{{ content }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  headline: { type: String, default: '' },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
});
</script>
