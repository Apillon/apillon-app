<script lang="ts" setup>
import { useAccount, useConnect, useConnectorClient } from '@wagmi/vue';

defineProps({
  loading: { type: Boolean, default: false },
});

const { fullPath } = useRoute();
const config = useRuntimeConfig();
const { connector: activeConnector, isConnected } = useAccount();
const { refetch } = useConnectorClient();
const { connect, connectors, pendingConnector, isLoading } = useConnect();

const Btn = resolveComponent('Btn');

function connectWallet(connector) {
  if (isConnected.value) {
    refetch();
  } else {
    connect({ connector });
  }
}
</script>

<template>
  <n-space :size="24" vertical>
    <Btn
      v-for="(connector, key) in connectors"
      :key="key"
      class="card relative flex cursor-pointer justify-start py-3 pl-2 pr-4"
      type="secondary"
      size="large"
      :loading="
        (connector.id === pendingConnector?.id && isLoading) || (connector.id === activeConnector?.id && loading)
      "
      @click="connectWallet(connector)"
    >
      <span class="ml-2 flex flex-1 items-center justify-start gap-2">
        <NuxtIcon :name="`wallet/${connector.type}`" class="text-xl" filled />
        <span class="font-normal text-white">{{ connector.name }}</span>
      </span>
    </Btn>
  </n-space>
</template>
