<template>
  <Heading
    v-bind="$attrs"
    :headline="$t('dashboard.nav.rpc')"
    docs="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html"
  >
    <template #details>
      <RpcFeatures />
      <hr class="my-10 border-bg-lighter" />
      <div>
        <div v-if="rpcApiKeyStore.selectedId && rpcApiKeyStore?.usage">
          <RpcProgress
            :current-calls="rpcApiKeyStore?.usage?.totalRequests ?? 0"
            :max-calls="hasRpcPlan ? 25000000 : 5000000"
          />
        </div>
        <div class="flex flex-row items-center justify-end gap-4">
          <div>
            <p class="font-bold text-white">
              {{ $t('dashboard.payment.currentPlan') }}: {{ hasRpcPlan ? 'Developer' : 'Free' }}
            </p>
          </div>
          <Btn
            v-if="dataStore.isUserOwner && paymentStore.isRpcPlanLoaded && !hasRpcPlan"
            class="font-bold no-underline"
            type="link"
            @click="modalSubscriptionVisible = true"
          >
            <span class="text-sm text-blue">{{ $t('dashboard.payment.upgrade') }}</span>
          </Btn>
        </div>
      </div>
      <hr class="my-10 border-bg-lighter" />
    </template>

    <template #info>
      <div
        v-if="
          dataStore.isUserOwner &&
          paymentStore.isRpcPlanLoaded &&
          !hasRpcPlan &&
          (rpcApiKeyStore?.usage?.totalRequests ?? 0) > 5000000
        "
        class="relative top-1 flex max-w-xl flex-row items-center justify-start gap-4 border-2 border-yellow p-3"
      >
        <span class="icon-info text-xl"></span>
        {{ $t('rpc.apiKey.pleaseUpgrade') }}
        <Btn type="primary" @click="modalSubscriptionVisible = true">
          {{ $t('dashboard.payment.upgrade') }}
        </Btn>
      </div>
    </template>

    <template #submenu>
      <MenuRpc class="left-0 top-0 z-1 w-full" />
    </template>
  </Heading>

  <!-- Modal - Subscription -->
  <modal v-model:show="modalSubscriptionVisible" class="max-w-3xl" :title="$t('rpc.apiKey.headline')">
    <RpcSubscriptions @close="modalSubscriptionVisible = false" />
  </modal>
</template>
<script lang="ts" setup>
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const rpcApiKeyStore = useRpcApiKeyStore();

const modalSubscriptionVisible = ref<boolean>(false);

onMounted(async () => {
  await paymentStore.getRpcPlan();

  if (rpcApiKeyStore.selectedId) {
    await rpcApiKeyStore.getRpcApiKeyUsage();
  }
});

const hasRpcPlan = computed(() => paymentStore.hasPaidRpcPlan);
</script>
