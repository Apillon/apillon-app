<template>
  <n-space v-bind="$attrs" class="items-center">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="rpcEndpointStore.search" />
    </div>
    <a
      class="text-sm text-yellow"
      href="https://app.formbricks.com/s/cm38pirih0001131eiwz4nj8v"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ $t('rpc.endpoint.requestNew') }}
    </a>
  </n-space>
</template>
<script lang="ts" setup>
const rpcEndpointStore = useRpcEndpointStore();
</script>
