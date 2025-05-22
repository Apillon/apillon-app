<template>
  <div v-if="chainId" class="flex items-center gap-2">
    <NuxtIcon :name="`logo/${getChainIconName(chainId)}`" class="inline-flex text-xl" filled />
    <p class="whitespace-nowrap">{{ getChainName(chainId) }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  chainId: { type: Number, default: null },
});

const { nftChains, chainsTestnet } = useCollection();
const chains = [...nftChains, ...chainsTestnet];

function getChainIconName(chainId?: number) {
  return chains.find(chain => chain.value === chainId)?.name?.toLowerCase();
}
function getChainName(collectionChain?: number) {
  return [...nftChains, ...chainsTestnet].find(chain => chain.value === collectionChain)?.label;
}
</script>
