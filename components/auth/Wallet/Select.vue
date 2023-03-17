<template>
  <n-space class="my-8" :size="24" vertical>
    <AuthWalletItem v-for="(wallet, key) in wallets" :key="key" :wallet="wallet" />
  </n-space>
</template>

<script lang="ts" setup>
const wallets = ref<Wallet[]>([]);

onMounted(() => {
  wallets.value = getWallets();
});
</script>
