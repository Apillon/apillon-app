<template>
  <Btn v-if="!isConnected" size="large" type="secondary" :loading="loading" @click="connectWallet">
    Connect your wallet
  </Btn>
  <Btn
    v-else-if="wrongNetwork"
    size="large"
    type="primary"
    :loading="loading"
    @click="ensureCorrectNetwork"
  >
    Switch Network
  </Btn>

  <Btn v-else type="primary" class="w-full" native-type="submit" @click="e => $emit('submit', e)">
    {{ btnText || 'Query' }}
  </Btn>
</template>

<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient, useNetwork, useSwitchNetwork } from 'use-wagmi';

defineEmits(['submit']);
defineProps({
  btnText: { type: String, default: null },
});

const { chain } = useNetwork();
const { switchNetwork } = useSwitchNetwork();

const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { isConnected } = useAccount({ onConnect: onWalletConnected });

const deployedContractStore = useDeployedContractStore();

const loading = ref(false);

async function onWalletConnected() {
  await sleep(200);
  if (loading.value) {
    loading.value = false;
  }
}

async function connectWallet() {
  if (!isConnected.value) {
    await wagmiConnect(connectors.value[0]);
  }
}

function wagmiConnect(connector) {
  if (isConnected.value) {
    refetchWalletClient();
  } else if (connector.ready) {
    connect({ connector });
  }
}

const wrongNetwork = computed(() => {
  // compare contract chain id to current wallet chain id
  return !chain || !chain.value || chain.value.id !== deployedContractStore.active.chain;
});

async function ensureCorrectNetwork() {
  await switchNetwork(deployedContractStore.active.chain);
  loading.value = false;
  return true;
}
</script>
