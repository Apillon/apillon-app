<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

defineProps({
  loading: { type: Boolean, default: false },
});

const { fullPath } = useRoute();
const config = useRuntimeConfig();
const { address, connector: activeConnector, isConnected } = useAccount();
const { refetch } = useWalletClient();
const { connect, connectors, pendingConnector, isLoading } = useConnect();

const Btn = resolveComponent('Btn');

function connectWallet(connector) {
  if (isConnected.value) {
    refetch();
  } else if (connector.ready) {
    connect({ connector });
  }
}
</script>

<template>
  <n-space :size="24" vertical>
    <component
      :is="connector.ready ? Btn : 'div'"
      v-for="(connector, key) in connectors"
      :key="key"
      class="flex justify-start"
      :class="{
        'relative card flex items-center py-3 pl-2 pr-4 pointer-events-none': !connector.ready,
      }"
      type="secondary"
      size="large"
      :loading="
        (connector.id === pendingConnector?.id && isLoading) ||
        (connector.id === activeConnector?.id && loading)
      "
      :disabled="!connector.ready"
      @click="connectWallet(connector)"
    >
      <span class="flex flex-1 justify-start gap-2 items-center ml-2">
        <NuxtIcon :name="`wallet/${connector.id}`" class="text-xl" filled />
        <span class="text-white font-normal">{{ connector.name }}</span>
      </span>

      <Btn
        v-if="!connector.ready"
        class="inline-block relative pointer-events-auto z-1"
        type="link"
        :href="`https://metamask.app.link/dapp/${config.public.url}${fullPath}`"
        target="_blank"
      >
        {{ $t('general.install') }}
      </Btn>
    </component>
  </n-space>
</template>
