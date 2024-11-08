<template>
  <div class="flex justify-between">
    <div>
      <select-options
        v-if="rpcApiKeyStore.hasRpcApiKeys"
        v-model:value="rpcApiKeyStore.selectedId"
        :options="options"
        class="min-w-[11rem] w-[20vw] max-w-xs"
        size="small"
        filterable
      />
    </div>

    <div class="flex space-x-2">
      <Btn
        class="font-bold no-underline"
        type="secondary"
        ghost
        @click="$router.push(`/dashboard/service/rpc/endpoints`)"
      >
        {{ $t('rpc.endpoint.viewAll') }}
      </Btn>
      <Btn
        type="secondary"
        inner-class="text-white flex items-center justify-center"
        href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html"
      >
        <span class="icon-file text-xl mr-2"></span>
        <span>{{ $t('rpc.endpoint.viewDocumentation') }}</span>
      </Btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const rpcApiKeyStore = useRpcApiKeyStore();

/** RPC Api keys */
const options = computed<SelectOption[]>(() =>
  rpcApiKeyStore.items.map(item => ({
    value: item.id,
    label: item.name,
  }))
);
</script>
