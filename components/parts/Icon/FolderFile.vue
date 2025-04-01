<template>
  <span class="align-text-bottom text-xl" :class="iconClass"></span>
</template>

<script lang="ts" setup>
const props = defineProps({
  isFile: {
    type: Boolean,
    default: false,
  },
});

const iconClass = computed(() => {
  return [props.isFile ? 'icon-file' : 'icon-folder'];
});
</script>
