<script lang="ts" setup>
defineProps({
  large: { type: Boolean, default: false },
});
</script>

<template>
  <NuxtLink to="/" class="inline-block text-center">
    <Image src="/images/logo.png" :width="large ? 202 : 88" :height="large ? 188 : 82" />
  </NuxtLink>
</template>
