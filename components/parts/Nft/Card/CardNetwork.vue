<template>
  <div class="rounded-md p-4">
    <div class="flex justify-between gap-2">
      <div class="flex items-center justify-between gap-2">
        <NuxtIcon :name="`logo/${name}`" class="mx-auto flex justify-center text-xl" filled />
        <p>{{ label }}</p>
      </div>
      <strong>{{ price }} {{ $t('dashboard.credits.credit') }}</strong>
    </div>
    <p v-if="$te(`nft.network.${chainId}.advantage`) && $t(`nft.network.${chainId}.advantage`)" class="mt-2">
      {{ $t(`nft.network.${chainId}.advantage`) }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  chainId: { type: Number, default: 0 },
  price: { type: Number, default: 1 },
  name: { type: String, default: null },
  label: { type: String, default: null },
});
</script>
