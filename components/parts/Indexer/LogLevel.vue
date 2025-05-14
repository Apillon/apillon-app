<template>
  <n-tag v-bind="$attrs" :type="convertLogLevelToType(logLevel)" :bordered="false" size="tiny" round>
    <n-space :class="'text-bg-dark'" :size="0" align="center" :wrap="false">
      <span class="mx-1 uppercase">{{ logLevel }}</span>
    </n-space>
  </n-tag>
</template>

<script lang="ts" setup>
defineProps({
  logLevel: {
    type: String,
    default: '',
  },
});

/** Deployment status */
function convertLogLevelToType(logLevel: string): TagType {
  switch (logLevel.toUpperCase()) {
    case 'INFO':
      return 'success';
    case 'WARNING':
      return 'warning';
    case 'ERROR':
      return 'error';
    default:
      return 'default';
  }
}
</script>
