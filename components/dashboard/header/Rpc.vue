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
    <template #submenu>
      <n-collapse
        class="border-b-1 border-bg-lighter -mt-4 pb-4"
        accordion
        @update:expanded-names="onUpdateAccordion"
      >
        <n-collapse-item>
          <template #header>
            <span class="icon-info text-xl mr-2"></span>
            {{
              instructionsVisible ? $t('general.information.hide') : $t('general.information.show')
            }}
          </template>
          <RpcFeatures />
        </n-collapse-item>
      </n-collapse>

      <MenuRpc />
    </template>
  </Heading>
</template>
<script lang="ts" setup>
const paymentStore = usePaymentStore();
const dataStore = useDataStore();
const rpcApiKeyStore = useRpcApiKeyStore();
const instructionsVisible = ref<boolean>(false);

function onUpdateAccordion(expandedNames: Array<string | number>) {
  instructionsVisible.value = expandedNames.length > 0;
}

onMounted(async () => {
  await paymentStore.getRpcPlan();

  if (rpcApiKeyStore.selectedId) {
    await rpcApiKeyStore.getRpcApiKeyUsage();
  }
});

const hasRpcPlan = computed(() => paymentStore.hasPaidRpcPlan);
</script>
