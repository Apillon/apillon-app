<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="rpcApiKeyStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Create new contract -->
      <n-button size="small" :disabled="authStore.isAdmin()" @click="modalCreateKeyVisible = true">
        <span class="text-primary">{{ $t('rpc.apiKey.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - Create Key -->
  <modal v-model:show="modalCreateKeyVisible" :title="$t('rpc.apiKey.new')">
    <FormRpcApiKey @submit-success="modalCreateKeyVisible = false" @create-success="onKeyCreated" />
  </modal>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const rpcApiKeyStore = useRpcApiKeyStore();
const { onKeyCreated } = useRpc();

const modalCreateKeyVisible = ref<boolean>(false);
</script>
