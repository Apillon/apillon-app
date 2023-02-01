<template>
  <n-modal v-bind="$attrs" :title="title" preset="dialog" :bordered="false" :show-icon="false">
    <slot />
  </n-modal>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: null },
});
</script>
