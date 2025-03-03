<template>
  <NftCardSelect :icon="icon" :title="title" content="content" />
</template>

<script lang="ts" setup>
defineProps({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
});
</script>
