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
      <n-button
        v-if="props.showUsageRefresh"
        size="small"
        @click="rpcApiKeyStore.fetchRpcApiKeyUsagePerChain"
        :loading="rpcApiKeyStore.loading"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <n-button size="small" @click="$router.push(`/dashboard/service/rpc/endpoints`)">
        <span class="text-primary">{{ $t('rpc.endpoint.viewAll') }}</span>
      </n-button>

      <BtnDocumentation
        size="small"
        href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html"
        hover-lighter
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const props = defineProps({
  showUsageRefresh: { type: Boolean, default: false },
});

const rpcApiKeyStore = useRpcApiKeyStore();

/** RPC Api keys */
const options = computed<SelectOption[]>(() =>
  rpcApiKeyStore.items.map(item => ({
    value: item.id,
    label: item.name,
  }))
);
</script>
