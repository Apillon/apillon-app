<template>
  <n-drawer :width="isLg ? 774 : '100%'">
    <n-drawer-content :title="title" closable>
      <slot />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: '' },
});
const { isLg } = useScreen();
</script>
