<template>
  <NuxtLink :to="{ name: 'dashboard' }" class="inline-block text-center h-10">
    <Image src="/images/logo/apillon.png" :width="162" :height="28" :alt="alt" />
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps({
  alt: { type: String, default: 'Apillon logo' },
});
</script>
