<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderRpc v-if="isRpcActivated" />
    </template>

    <template v-if="isRpcActivated">
      <n-space class="my-8">
        <select-options
          v-if="rpcApiKeyStore.hasRpcApiKeys"
          v-model:value="rpcApiKeyStore.selectedId"
          :options="options"
          class="min-w-[11rem] w-[20vw] max-w-xs"
          size="small"
          filterable
        />
      </n-space>
      <div class="flex flex-between">
        <MenuRpc />
      </div>
      <slot>
        <div class="flex justify-end">
          <Btn
            class="font-bold no-underline"
            type="link"
            @click="router.push(`/dashboard/service/rpc/endpoints`)"
          >
            {{ $t('rpc.endpoint.viewAll') }}
          </Btn>
        </div>
      </slot>
      <slot v-if="endpoints.length > 0">
        <TableRpcEndpoint
          :rpc-endpoints="rpcEndpointStore.items.filter(item => item.isFavorite)"
          :is-owner="dataStore.isUserOwner"
        />
      </slot>
      <Empty
        v-else
        :title="$t('rpc.endpoint.noFavoriteEndpointTitle')"
        :info="$t('rpc.endpoint.noFavoriteEndpointDescription')"
        icon="storage/empty"
      >
        <Btn type="primary" @click="router.push(`/dashboard/service/rpc/endpoints`)">
          {{ $t('rpc.endpoint.browse') }}
        </Btn>
      </Empty>
    </template>
    <template v-else-if="!rpcApiKeyStore.selectedId">
      <RpcNoApiKeys />
    </template>
    <template v-else>
      <RpcDisabled />
    </template>
  </Dashboard>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';

const { t } = useI18n();

const rpcApiKeyStore = useRpcApiKeyStore();
const rpcEndpointStore = useRpcEndpointStore();

const dataStore = useDataStore();
const router = useRouter();

const pageLoading = ref<boolean>(true);
const isRpcActivated = ref<boolean>(false);
const initialLoadComplete = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.rpc'),
});

onMounted(async () => {
  await Promise.all(Object.values(dataStore.promises));

  await dataStore.getServices();

  const isRpcServiceActivated = dataStore.hasServicesByType(ServiceType.RPC);

  isRpcActivated.value = isRpcServiceActivated;

  if (isRpcServiceActivated) {
    await rpcApiKeyStore.getApiKeys();
    if (!rpcApiKeyStore.selectedId && rpcApiKeyStore.items.length > 0) {
      rpcApiKeyStore.selectedId = rpcApiKeyStore.items[0].id;
    }

    await rpcEndpointStore.getEndpoints();
  }

  pageLoading.value = false;
  initialLoadComplete.value = true;
});

/** Bucket type */
const options = computed<SelectOption[]>(() =>
  rpcApiKeyStore.items.map(item => ({
    value: item.id,
    label: item.name,
  }))
);

const endpoints = computed(() => rpcEndpointStore.items.filter(item => item.isFavorite));

watch(
  () => rpcApiKeyStore.selectedId,
  async newId => {
    if (initialLoadComplete.value && newId) {
      pageLoading.value = true;
      rpcApiKeyStore.handleSelectedIdChange();

      await rpcEndpointStore.getEndpoints();

      pageLoading.value = false;
    }
  }
);
</script>
