<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderRpc />
    </template>
    <slot>
      <n-space v-if="rpcApiKeyStore.hasRpcApiKeys" :size="32" vertical>
        <div class="flex justify-between flex-row">
          <MenuRpc />
          <ActionsRpcApiKey v-if="dataStore.isUserOwner" />
        </div>
        <TableRpcApiKey :is-owner="dataStore.isUserOwner" />
      </n-space>
      <RpcNoApiKeys v-else />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const rpcApiKeyStore = useRpcApiKeyStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('dashboard.nav.rpc'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await rpcApiKeyStore.getApiKeys();

      pageLoading.value = false;
    });
  }, 100);
});
</script>
