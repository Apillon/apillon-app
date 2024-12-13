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
    <component
      :is="connector.ready ? Btn : 'div'"
      v-for="(connector, key) in connectors"
      :key="key"
      class="flex justify-start"
      :class="{
        'card pointer-events-none relative flex items-center py-3 pl-2 pr-4': !connector.ready,
      }"
      type="secondary"
      size="large"
      :loading="
        (connector.id === pendingConnector?.id && isLoading) || (connector.id === activeConnector?.id && loading)
      "
      :disabled="!connector.ready"
      @click="connectWallet(connector)"
    >
      <span class="ml-2 flex flex-1 items-center justify-start gap-2">
        <NuxtIcon :name="`wallet/${connector.id}`" class="text-xl" filled />
        <span class="font-normal text-white">{{ connector.name }}</span>
      </span>

      <Btn
        v-if="!connector.ready"
        class="pointer-events-auto relative z-1 inline-block"
        type="link"
        :href="`https://metamask.app.link/dapp/${config.public.url}${fullPath}`"
        target="_blank"
      >
        {{ $t('general.install') }}
      </Btn>
    </component>
  </n-space>
</template>
