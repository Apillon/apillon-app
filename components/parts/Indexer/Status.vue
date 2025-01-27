<template>
  <n-tag v-bind="$attrs" :type="status" :bordered="false" size="tiny" round>
    <n-space :class="'text-bg-dark'" :size="0" align="center" :wrap="false">
      <span class="mx-1 uppercase"><slot /></span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  status: {
    type: String,
    default: 0,
  },
});
</script>
