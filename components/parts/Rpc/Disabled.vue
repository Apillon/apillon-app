<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <h1>{{ $t('dashboard.nav.rpc') }}</h1>
      </Heading>
    </template>

    <slot>
      <div class="flex h-full flex-col pb-8">
        <div class="flex flex-grow flex-col">
          <RpcFeatures />
          <div class="flex flex-col gap-8">
            <p class="text-sm font-bold text-white">{{ $t('rpc.apiKey.start') }}</p>

            <div>
              <FormService
                class="mt-4 inline-block min-w-52 pr-4"
                :service-type="ServiceType.RPC"
                default-service-name="RPC service"
                :btn-text="$t('rpc.apiKey.turnOnService')"
                :disabled="!dataStore.isUserOwner"
                @create-success="$emit('serviceCreated')"
              />
              <BtnDocumentation
                class="relative top-[2px]"
                href="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html"
              />
              <p v-if="!dataStore.isUserOwner" class="mt-2">
                {{ $t('rpc.apiKey.mustBeOwner') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </slot>

    <template #learn>
      <div class="card-light rounded-lg p-8">
        <n-space :size="24" vertical>
          <div>
            <h3 class="font-bold">{{ $t('rpc.apiKey.curious') }}</h3>
            <p class="font-normal">{{ $t('rpc.apiKey.explore') }}</p>
          </div>
          <ActionsRpcPublicEndpoint />
          <TableRpcPublicEndpoint v-if="rpcEndpointStore.hasPublicEndpoints" class="mb-4" :rpc-endpoints="tableData" />
        </n-space>
      </div>
    </template>
  </Dashboard>
</template>
<script lang="ts" setup>
defineEmits(['serviceCreated']);
const { t } = useI18n();
const dataStore = useDataStore();
const rpcEndpointStore = useRpcEndpointStore();

const pageLoading = ref<boolean>(true);

const tableData = computed(() => {
  const allEndpoints = rpcEndpointStore.publicEndpoints;
  const priorityOrder = ['Base', 'Celo', 'Moonbeam', 'Gnosis', 'Polkadot'];

  const prioritizedEndpoints = allEndpoints.filter(endpoint => priorityOrder.includes(endpoint.name));
  const otherEndpoints = allEndpoints.filter(endpoint => !priorityOrder.includes(endpoint.name));

  prioritizedEndpoints.sort((a, b) => a.name.localeCompare(b.name));

  return [...prioritizedEndpoints, ...otherEndpoints];
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await rpcEndpointStore.getPublicEndpoints();

  pageLoading.value = false;
});
</script>
