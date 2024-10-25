<template>
  <Heading>
    <slot>
      <h1>{{ $t('dashboard.nav.rpc') }}</h1>
    </slot>
    <template #info>
      <div>
        <div v-if="rpcApiKeyStore.selectedId && rpcApiKeyStore?.usage">
          <RpcProgress
            :current-calls="rpcApiKeyStore?.usage?.totalRequests ?? 0"
            :max-calls="hasRpcPlan ? 25000000 : 5000000"
          />
        </div>
        <div class="flex flex-row gap-4 items-center justify-end">
          <div>
            <p class="text-white font-bold">
              {{ $t('dashboard.payment.currentPlan') }}: {{ hasRpcPlan ? 'Developer' : 'Free' }}
            </p>
          </div>
          <Btn
            v-if="dataStore.isUserOwner && paymentStore.isRpcPlanLoaded && !hasRpcPlan"
            class="font-bold no-underline"
            type="link"
            to="/dashboard/service/rpc/subscription"
          >
            <span class="text-blue text-sm">{{ $t('dashboard.payment.upgrade') }}</span>
          </Btn>
        </div>
      </div>
    </template>
  </Heading>
</template>
<script lang="ts" setup>
const paymentStore = usePaymentStore();
const dataStore = useDataStore();
const rpcApiKeyStore = useRpcApiKeyStore();

onMounted(async () => {
  await paymentStore.getRpcPlan();

  if (rpcApiKeyStore.selectedId) {
    await rpcApiKeyStore.getRpcApiKeyUsage();
  }
});

const hasRpcPlan = computed(() => paymentStore.hasPaidRpcPlan);
</script>
