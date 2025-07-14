<template>
  <div v-if="chainId" class="inline-flex items-center gap-2">
    <NuxtIcon
      :name="`logo/${getChainIconName(chainId)}`"
      class="inline-flex text-xl"
      :title="getChainIconName(chainId)"
      filled
    />
    <p class="whitespace-nowrap">{{ getChainName(chainId) }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  chainId: { type: Number, default: null },
});

const { getChainName, getChainIconName } = useCollection();
</script>
