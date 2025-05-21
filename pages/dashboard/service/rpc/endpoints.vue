<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading
        :back="rpcEndpointStore.hasFavorites ? { name: 'dashboard-service-rpc' } : undefined"
        :headline="$t('rpc.endpoint.allEndpoints')"
      />
    </template>

    <n-space v-if="rpcApiKeyStore.selectedId" class="pb-8" :size="32" vertical>
      <ActionsRpcEndpoint />
      <TableRpcEndpoint :rpcEndpoints="rpcEndpointStore.items" :allowFavoriteCheck="true" />
    </n-space>
    <template v-else>
      <RpcNoEndpoints />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const rpcApiKeyStore = useRpcApiKeyStore();
const rpcEndpointStore = useRpcEndpointStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.rpc'),
});

onMounted(async () => {
  if (!rpcApiKeyStore.selectedId) {
    await rpcApiKeyStore.getApiKeys();
    if (rpcApiKeyStore.hasRpcApiKeys) {
      rpcApiKeyStore.selectedId = rpcApiKeyStore.items[0].id;
    }
  }

  await rpcEndpointStore.getEndpoints();

  pageLoading.value = false;
});
</script>
