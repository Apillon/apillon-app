<template>
  <FormFieldSearch v-model:value="rpcEndpointStore.publicEndpointsSearch" class="bg-bg-dark" />
</template>
<script lang="ts" setup>
const rpcEndpointStore = useRpcEndpointStore();
</script>
