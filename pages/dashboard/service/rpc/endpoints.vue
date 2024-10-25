<!-- eslint-disable vue/attribute-hyphenation -->
<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <div class="flex gap-4 items-center">
            <NuxtLink :to="{ name: 'dashboard-service-rpc' }">
              <span class="icon-back text-2xl align-sub"></span>
            </NuxtLink>
            <div>
              <h2>{{ $t('rpc.endpoint.allEndpoints') }}</h2>
            </div>
          </div>
        </slot>
      </Heading>
    </template>
    <template v-if="rpcApiKeyStore.selectedId">
      <slot>
        <ActionsRpcEndpoint />
      </slot>
      <slot>
        <TableRpcEndpoint :rpcEndpoints="rpcEndpointStore.items" :allowFavoriteCheck="true" />
      </slot>
    </template>
    <template v-else>
      <RpcNoApiKeys />
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
    rpcApiKeyStore.selectedId = rpcApiKeyStore.items[0].id;
  }

  await rpcEndpointStore.getEndpoints();

  pageLoading.value = false;
});
</script>
