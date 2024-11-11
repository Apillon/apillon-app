<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <h1>{{ t('dashboard.nav.rpc') }}</h1>
      </Heading>
    </template>

    <slot>
      <div class="flex flex-col h-full pb-8">
        <div class="flex flex-col flex-grow">
          <RpcFeatures />
          <div class="flex flex-col gap-8">
            <p class="text-sm font-bold text-white">{{ $t('rpc.apiKey.start') }}</p>

            <div>
              <FormService
                class="mt-4 pr-4 inline-block min-w-52"
                :service-type="ServiceType.RPC"
                default-service-name="RPC service"
                :btn-text="$t('rpc.apiKey.turnOnService')"
                :disabled="!dataStore.isUserOwner"
                @create-success="$emit('serviceCreated')"
              />
              <p v-if="!dataStore.isUserOwner" class="mt-4">
                {{ $t('rpc.apiKey.mustBeOwner') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </slot>

    <template #learn>
      <div class="card-light p-8 rounded-lg">
        <n-space :size="24" vertical>
          <div>
            <h3 class="font-bold">{{ $t('rpc.apiKey.curious') }}</h3>
            <p class="font-normal">{{ $t('rpc.apiKey.explore') }}</p>
          </div>
          <ActionsRpcPublicEndpoint />
          <TableRpcPublicEndpoint
            v-if="rpcEndpointStore.hasPublicEndpoints"
            class="mb-4"
            :rpc-endpoints="rpcEndpointStore.publicEndpoints"
          />
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

onMounted(async () => {
  await Promise.all(Object.values(dataStore.promises));
  await rpcEndpointStore.getPublicEndpoints();

  pageLoading.value = false;
});
</script>
