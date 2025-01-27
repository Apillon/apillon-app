<template>
  <Empty :title="$t('rpc.apiKey.empty')" :info="$t('rpc.apiKey.emptyInfo')" icon="storage/empty">
    <Btn type="primary" :disabled="authStore.isAdmin()" @click="modalCreateKeyVisible = true">
      {{ $t('rpc.apiKey.createFirst') }}
    </Btn>
  </Empty>

  <modal v-model:show="modalCreateKeyVisible" :title="$t('rpc.apiKey.new')">
    <FormRpcApiKey @submit-success="modalCreateKeyVisible = false" @create-success="onKeyCreated" />
  </modal>
</template>

<script lang="ts" setup>
const { onKeyCreated } = useRpc();
const authStore = useAuthStore();
const modalCreateKeyVisible = ref<boolean>(false);
</script>
