<template>
  <Tag v-if="logLevel !== null" :type="convertLogLevelToType(logLevel)">
    {{ logLevel }}
  </Tag>
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
