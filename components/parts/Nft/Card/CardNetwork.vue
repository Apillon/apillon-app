<template>
  <CardSelect :content="$t(`nft.network.${chainId}.advantage`)" :disabled="disabled" :selected="selected">
    <template #title>
      <div class="flex w-full justify-between gap-2">
        <div class="flex items-center justify-between gap-2">
          <NuxtIcon :name="`logo/${name}`" class="mx-auto flex justify-center text-xl" filled />
          <p>{{ label }}</p>
        </div>
        <strong>{{ price }} {{ $t('dashboard.credits.credit') }}</strong>
      </div>
    </template>
    <template #additional>
      <slot />
    </template>
  </CardSelect>
</template>

<script lang="ts" setup>
defineProps({
  chainId: { type: Number, default: 0 },
  price: { type: Number, default: 1 },
  name: { type: String, default: null },
  label: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
});
</script>
