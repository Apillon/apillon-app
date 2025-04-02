<template>
  <Btn
    v-if="!isConnected"
    size="large"
    type="secondary"
    :loading="loading"
    @click="connect({ connector: connectors[0] })"
  >
    Connect your wallet
  </Btn>
  <Btn v-else-if="wrongNetwork" size="large" type="primary" :loading="loading" @click="ensureCorrectNetwork">
    Switch Network
  </Btn>

  <Btn v-else type="primary" class="w-full" native-type="submit" @click="e => $emit('submit', e)">
    {{ btnText }}
  </Btn>
</template>

<script lang="ts" setup>
import { useAccount, useAccountEffect, useConnect, useChainId, useSwitchChain } from '@wagmi/vue';

defineEmits(['submit']);
defineProps({
  btnText: { type: String, default: null },
});

const chainId = useChainId();
const { switchChain } = useSwitchChain();

const { connect, connectors } = useConnect();
const { isConnected } = useAccount();
useAccountEffect({ onConnect: onWalletConnected });

const deployedContractStore = useDeployedContractStore();

const loading = ref(false);

async function onWalletConnected() {
  await sleep(200);
  if (loading.value) {
    loading.value = false;
  }
}

const wrongNetwork = computed(() => {
  return chainId.value !== deployedContractStore.active.chain;
});

async function ensureCorrectNetwork() {
  await switchChain({ chainId: deployedContractStore.active.chain });
  loading.value = false;
  return true;
}
</script>
