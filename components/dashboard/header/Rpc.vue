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
            @click="modalSubscriptionVisible = true"
          >
            <span class="text-blue text-sm">{{ $t('dashboard.payment.upgrade') }}</span>
          </Btn>
        </div>
      </div>
    </template>
    <template #submenu>
      <div
        class="flex mb-4 flex-row justify-start border-yellow border-2 p-4 items-center gap-4 max-w-xl"
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
        <MenuRpc class="lg:absolute top-0 left-0 w-2/3 z-1" />
        <n-collapse
          v-if="isLg"
          class="justify-end"
          accordion
          @update:expanded-names="onUpdateAccordion"
        >
          <n-collapse-item>
            <template #header>
              {{
                instructionsVisible
                  ? $t('general.information.hide')
                  : $t('general.information.show')
              }}
              <span class="icon-info text-xl ml-2"></span>
            </template>
            <RpcFeatures />
          </n-collapse-item>
        </n-collapse>
      </div>
    </template>
  </Heading>

  <!-- Modal - Subscription -->
  <modal
    v-model:show="modalSubscriptionVisible"
    class="max-w-3xl"
    :title="$t('rpc.apiKey.headline')"
  >
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
