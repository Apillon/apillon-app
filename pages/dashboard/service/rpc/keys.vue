<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderRpcKeys />
    </template>
    <slot>
      <n-space v-if="rpcApiKeyStore.hasRpcApiKeys" :size="32" vertical>
        <div>
          <ActionsRpcApiKey v-if="dataStore.isUserOwner" />
        </div>
        <TableRpcApiKey :is-owner="dataStore.isUserOwner" />
      </n-space>
      <RpcNoApiKeys v-else />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const rpcApiKeyStore = useRpcApiKeyStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.rpc'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await rpcApiKeyStore.getApiKeys();

  pageLoading.value = false;
});
</script>
