<template>
  <ServiceEmpty
    v-if="!dataStore.project.selected"
    docs="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#rpc-service"
    :name="toCamelCase(ServiceTypeName.RPC)"
    :service="ServiceTypeName.RPC"
    :guides="serviceGuides"
    :image="BannerWEBP"
    powered-by="dwellir"
  />
  <RpcDisabled v-else-if="!isRpcActivated && !pageLoading" @service-created="onServiceCreated" />
  <Dashboard v-else :loading="pageLoading">
    <template #heading>
      <HeaderRpc v-if="isRpcActivated" />
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <ActionsRpc />
      <RpcNoApiKeys v-if="!rpcApiKeyStore.hasRpcApiKeys" />
      <TableRpcEndpoint
        v-else-if="endpoints.length > 0"
        :rpc-endpoints="rpcEndpointStore.items.filter(item => item.isFavorite)"
        :is-owner="dataStore.isUserOwner"
      />
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
    </n-space>
  </Dashboard>
  <!-- Modal - Subscription -->
  <modal v-model:show="modalSubscriptionVisible" class="max-w-3xl" :title="$t('rpc.apiKey.headline')">
    <RpcSubscriptions @close="modalSubscriptionVisible = false" />
  </modal>
</template>

<script lang="ts" setup>
import BannerWEBP from '/assets/images/service/rpc.webp';

const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const rpcApiKeyStore = useRpcApiKeyStore();
const rpcEndpointStore = useRpcEndpointStore();

const pageLoading = ref<boolean>(true);
const isRpcActivated = ref<boolean>(false);
const initialLoadComplete = ref<boolean>(false);
const modalSubscriptionVisible = ref<boolean>(false);
const isInitialVisit = ref<boolean>(false);

const serviceGuides = [
  {
    title: 'RPC in blockchain: A beginner’s guide to seamless dapp interaction',
    content:
      'Unlock the RPC magic. Learn how this vital tech bridges the gap between Web2 APIs and Web3 dapps for seamless connectivity.',
    link: 'https://blog.apillon.io/rpc-in-blockchain-a-beginners-guide-to-seamless-dapp-interaction-b67a632d44ba/',
  },
  {
    title: 'Top 5 RPC providers compared: features that matter most',
    content:
      'From speed demons to budget-friendly champs, here’s a deep dive into top RPC providers. Compare speed, reliability and other benefits.',
    link: 'https://blog.apillon.io/top-5-rpc-providers-compared-features-that-matter-most-2791f9adbefb/',
  },
];

useHead({
  title: t('dashboard.nav.rpc'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await dataStore.getServices();

  await initRpc();

  pageLoading.value = false;
  initialLoadComplete.value = true;
});

const endpoints = computed(() => rpcEndpointStore.items.filter(item => item.isFavorite));

watch(
  () => rpcApiKeyStore.selectedId,
  async newId => {
    if (initialLoadComplete.value && newId) {
      pageLoading.value = true;
      rpcApiKeyStore.handleSelectedIdChange();

      await rpcEndpointStore.getEndpoints();

      if (!rpcEndpointStore.hasFavorites && rpcApiKeyStore.selectedId) {
        router.replace({ name: 'dashboard-service-rpc-endpoints' });
      }

      pageLoading.value = false;
    }
  }
);

watch(
  () => modalSubscriptionVisible.value,
  async isVisible => {
    if (isVisible) {
      return;
    }

    if (isInitialVisit.value) {
      router.replace({ name: 'dashboard-service-rpc-endpoints' });
    }
  }
);

function onServiceCreated() {
  modalSubscriptionVisible.value = true;
  isInitialVisit.value = true;
}

async function initRpc() {
  isRpcActivated.value = dataStore.hasServicesByType(ServiceType.RPC);

  if (isRpcActivated.value) {
    await rpcApiKeyStore.getApiKeys();
    if (!rpcApiKeyStore.selectedId && rpcApiKeyStore.items.length > 0) {
      rpcApiKeyStore.selectedId = rpcApiKeyStore.items[0].id;
    }

    await rpcEndpointStore.getEndpoints();

    if (!rpcEndpointStore.hasFavorites && rpcApiKeyStore.selectedId) {
      await router.replace({ name: 'dashboard-service-rpc-endpoints' });
    }
  }
}
</script>
