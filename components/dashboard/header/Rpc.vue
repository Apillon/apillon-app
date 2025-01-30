<template>
  <Heading v-bind="$attrs">
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
    </template>
    <template #submenu>
      <div
        class="mb-4 flex max-w-xl flex-row items-center justify-start gap-4 border-2 border-yellow p-4"
        v-if="
          dataStore.isUserOwner &&
          paymentStore.isRpcPlanLoaded &&
          !hasRpcPlan &&
          (rpcApiKeyStore?.usage?.totalRequests ?? 0) > 5000000
        "
      >
        <span class="icon-info text-xl"></span>
        {{ $t('rpc.apiKey.pleaseUpgrade') }}
        <Btn type="primary" @click="modalSubscriptionVisible = true">
          {{ $t('dashboard.payment.upgrade') }}
        </Btn>
      </div>

      <div class="relative">
        <MenuRpc class="left-0 top-0 z-1 w-full" />
        <n-collapse accordion @update:expanded-names="onUpdateAccordion" v-if="isLg">
          <n-collapse-item>
            <template #header>
              {{ instructionsVisible ? $t('general.information.hide') : $t('general.information.show') }}
              <span class="icon-info ml-2 text-xl"></span>
            </template>
            <RpcFeatures />
          </n-collapse-item>
        </n-collapse>
      </div>
    </template>
  </Heading>

  <!-- Modal - Subscription -->
  <modal v-model:show="modalSubscriptionVisible" class="max-w-3xl" :title="$t('rpc.apiKey.headline')">
    <RpcSubscriptions @close="modalSubscriptionVisible = false" />
  </modal>
</template>
<script lang="ts" setup>
const { isLg } = useScreen();
const dataStore = useDataStore();
const paymentStore = usePaymentStore();
const rpcApiKeyStore = useRpcApiKeyStore();

const instructionsVisible = ref<boolean>(false);
const modalSubscriptionVisible = ref<boolean>(false);

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

<style lang="postcss" scoped>
:deep(.n-collapse-item__header) {
  @apply h-10;
}
:deep(.n-collapse-item__header--active) {
  @apply border-b-1 border-bg-lighter;
}
:deep(.n-collapse-item__header-main) {
  @apply justify-end;
}
:deep(.n-collapse-item__content-inner) {
  @apply my-4;
}
</style>
