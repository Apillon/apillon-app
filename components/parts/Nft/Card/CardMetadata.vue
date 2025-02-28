<template>
  <div class="my-6 flex cursor-pointer gap-2 rounded-md border p-4 text-sm">
    <NuxtIcon name="nft/metadata" class="text-5xl" filled />
    <div class="flex items-center justify-between gap-2">
      <strong>I want a fresh start</strong>
      <span>Start by adding new NFTs</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  chainId: { type: Number, default: 0 },
  price: { type: Number, default: 1 },
  name: { type: String, default: null },
  value: { type: String, default: null },
});
</script>
