<template>
  <h1>functions {{ props.name }}</h1>
</template>

<script setup lang="ts">
const props = defineProps({
  name: { type: String, default: '' },
});
</script>
