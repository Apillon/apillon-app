<template>
  <n-space v-bind="$attrs">
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
  </n-space>
</template>
<script lang="ts" setup>
const rpcEndpointStore = useRpcEndpointStore();
</script>
