<script lang="ts" setup>
import VLazyImage from 'v-lazy-image';
</script>

<template>
  <VLazyImage
    v-bind="$attrs"
    :src-placeholder="
      $attrs['src-placeholder'] ||
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    "
  />
</template>

<style scoped>
.v-lazy-image {
  filter: blur(4px);
  transition: filter 0.6s;
  will-change: filter;
}

.v-lazy-image-loaded {
  filter: blur(0);
}
</style>
