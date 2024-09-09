<template>
  <Btn
    v-if="needsWalletConnection(fn.onlyOwner) && !isConnected"
    class="w-full text-yellow btn-connect bg-transparent"
    type="secondary"
    native-type="submit"
    :loading="loading"
    @click="connectWallet"
  >
    Connect your wallet
  </Btn>
  <Btn
    v-else-if="isConnected && wrongNetwork"
    class="w-full"
    type="primary"
    native-type="submit"
    :loading="loading"
    @click="ensureCorrectNetwork"
  >
    Switch Network
  </Btn>

  <Btn
    v-else
    type="primary"
    class="w-full"
    native-type="submit"
    :loading="loading"
    @click="$emit('submit')"
  >
    Query
  </Btn>
</template>

<script lang="ts" setup>
import { createPublicClient, createWalletClient, custom, http } from 'viem';

import { useAccount, useConnect, useWalletClient, useNetwork, useSwitchNetwork } from 'use-wagmi';

defineEmits(['submit']);
const props = defineProps({});

const { chain } = useNetwork();
const { switchNetwork } = useSwitchNetwork();

const { connect, connectors } = useConnect();
const { refetch: refetchWalletClient } = useWalletClient();
const { isConnected } = useAccount({ onConnect: onWalletConnected });
const { address } = useAccount();

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
  btnLoading.value = false;
  return true;
}

function needsWalletConnection(onlyOwner) {
  if ((!onlyOwner && !isConnected.value) || (!isConnected.value && contractStatus.value === 6))
    return true;
  return false;
}
</script>
