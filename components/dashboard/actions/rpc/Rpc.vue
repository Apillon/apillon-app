<template>
  <div class="flex justify-between">
    <div>
      <div v-if="rpcApiKeyStore.hasRpcApiKeys" class="flex items-center gap-4">
        <select-options
          v-model:value="rpcApiKeyStore.selectedId"
          :options="options"
          class="min-w-[11rem] w-[20vw] max-w-xs"
          size="small"
          filterable
        />
        <Btn
          class="font-bold no-underline"
          type="link"
          :to="{ name: 'dashboard-service-rpc-keys' }"
          :inner-class="'flex gap-2 items-center text-white'"
        >
          <span class="text-sm">{{ $t('rpc.apiKey.management') }}</span>
          <span class="icon-project-setting"></span>
        </Btn>
      </div>
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
