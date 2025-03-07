<script lang="ts" setup>
import type { Connector } from '@wagmi/vue';
import { useAccount, useConnect, useConnectorClient, useAccountEffect } from '@wagmi/vue';

const emit = defineEmits(['connected']);
defineProps({
  loading: { type: Boolean, default: false },
});

const { connector: activeConnector, isConnected, isConnecting } = useAccount();
const { refetch } = useConnectorClient();
const { connect, connectors } = useConnect();

const connectorLoading = ref();

useAccountEffect({ onConnect: onWalletConnected });

function connectWallet(connector: Connector) {
  connectorLoading.value = connector.id;
  if (isConnected.value) {
    refetch();
  } else {
    connect({ connector });
  }
}

function onWalletConnected(args) {
  console.log(args);
  emit('connected', args.address);
}
</script>

<template>
  <n-space class="text-left" :size="24" vertical>
    <Btn
      v-for="(connector, key) in connectors"
      :key="key"
      type="secondary"
      size="large"
      :loading="
        (connector.id === connectorLoading && isConnecting) || (connector.id === activeConnector?.id && loading)
      "
      @click="connectWallet(connector)"
    >
      <span class="flex w-full items-center justify-start gap-2">
        <NuxtIcon :name="`wallet/${connector.type}`" class="text-xl" filled />
        <span class="font-normal text-white">{{ connector.name }}</span>
      </span>
    </Btn>
  </n-space>
</template>
