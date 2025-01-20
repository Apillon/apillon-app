<template>
  <n-space v-bind="$attrs" class="items-center">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="rpcEndpointStore.search"
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
    <a
      class="text-yellow text-sm"
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
