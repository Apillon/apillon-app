<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ t('dashboard.nav.rpc') }}</h1>
        </slot>
      </Heading>
    </template>

    <slot>
      <div class="flex flex-col h-full pb-8">
        <div class="flex flex-col flex-grow">
          <RpcFeatures />
          <div class="flex flex-col gap-8 border-b border-bg-lighter pb-8 my-8">
            <p class="text-sm font-bold text-white">{{ $t('rpc.apiKey.start') }}</p>

            <div>
              <FormService
                class="mt-4 pr-4 inline-block"
                :service-type="ServiceType.RPC"
                default-service-name="RPC service"
                :btn-text="$t('rpc.apiKey.turnOnService')"
                :disabled="!dataStore.isUserOwner"
                @create-success="onServiceCreated"
              />
              <p v-if="!dataStore.isUserOwner" class="mt-4">
                {{ $t('rpc.apiKey.mustBeOwner') }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="mb-2">
            <h4 class="font-bold">{{ $t('rpc.apiKey.curious') }}</h4>
            <h4 class="font-normal">{{ $t('rpc.apiKey.explore') }}</h4>
          </div>
          <ActionsRpcPublicEndpoint />
          <TableRpcPublicEndpoint
            v-if="rpcEndpointStore.hasPublicEndpoints"
            class="mb-4"
            :rpc-endpoints="rpcEndpointStore.publicEndpoints"
          />
        </div>
      </div>
    </slot>
  </Dashboard>
</template>
<script lang="ts" setup>
const { t } = useI18n();
const router = useRouter();
const rpcEndpointStore = useRpcEndpointStore();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);

const onServiceCreated = () => {
  router.push('/dashboard/service/rpc/subscription');
};

onMounted(async () => {
  await Promise.all(Object.values(dataStore.promises));

  await rpcEndpointStore.getPublicEndpoints();

  pageLoading.value = false;
});
</script>
