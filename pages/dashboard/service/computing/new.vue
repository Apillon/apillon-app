<template>
  <Dashboard full-height>
    <template #heading>
      <Heading>
        <slot>
          <h3>
            <NuxtLink :to="{ name: 'dashboard-service-computing' }">
              <span class="text-body font-normal">{{ $t('dashboard.nav.services') }}</span>
            </NuxtLink>
            <span class="mx-1">/</span>
            {{ $t('dashboard.nav.computing') }}
          </h3>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <ModalCreditCosts :service="ServiceTypeName.COMPUTING" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <SolutionTabs
        :solution="SolutionKey.ENCRYPTION"
        :tab="tab"
        :tabs="tabs"
        @change="t => (tab = t)"
      />
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const paymentStore = usePaymentStore();

useHead({
  title: $i18n.t('dashboard.nav.computing'),
});

const tab = ref<string>('choose');
const tabs = {
  choose: resolveComponent('SolutionNftContentDeliveryChoose'),
  configure: resolveComponent('SolutionNftContentDeliveryConfigure'),
  deploy: resolveComponent('SolutionNftContentDeliveryDeploy'),
};

onMounted(() => {
  paymentStore.getPriceList();
});
</script>
