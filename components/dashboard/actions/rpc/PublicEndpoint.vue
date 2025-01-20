<template>
  <n-input
    v-model:value="rpcEndpointStore.publicEndpointsSearch"
    class="bg-bg-dark"
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
</template>
<script lang="ts" setup>
const rpcEndpointStore = useRpcEndpointStore();
</script>
