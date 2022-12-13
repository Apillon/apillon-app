<template>
  <n-modal v-bind="$attrs">
    <n-card
      style="width: 660px"
      :title="title"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <slot />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: null },
});
</script>
