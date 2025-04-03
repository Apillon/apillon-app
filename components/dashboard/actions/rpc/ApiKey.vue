<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="rpcApiKeyStore.search" />
    </div>

    <n-space size="large">
      <!-- Create new contract -->
      <n-button size="medium" :disabled="authStore.isAdmin()" @click="modalCreateKeyVisible = true">
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
