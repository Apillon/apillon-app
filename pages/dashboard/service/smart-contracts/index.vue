<template>
  <Dashboard>
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContracts />
      </div>
    </template>

    <slot>
      <div class="pb-8">
        <div class="max-w-lg mb-8">
          <p>{{ $t('dashboard.smartContracts.description') }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <SmartContractsCard v-for="(contract, key) in contracts" :key="key">
            <div class="flex items-center gap-2 mb-4 text-green">
              <template v-if="contract.audited">
                <span class="icon-security"></span> Audited
              </template>
            </div>
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl" :class="contract.icon"></span>
              <h5>{{ contract.name }}</h5>
            </div>
            <p>{{ contract.description }}</p>
            <Btn type="secondary" class="mt-8" to="{ name: 'dashboard'}">
              {{ $t('dashboard.smartContracts.createNew') }}
            </Btn>
          </SmartContractsCard>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useHead({
  title: $i18n.t('dashboard.nav.smartContracts'),
});

const contracts = ref([
  {
    id: 1,
    key: 'dashboard-service',
    name: 'Smart Contracts',
    description: 'Deploy a contract and create a new token on EVM chains. ERC20 standard. ',
    audited: true,
    link: 'dashboard-service',
    icon: 'icon-file',
  },
  {
    id: 2,
    key: 'dashboard-service',
    name: 'Smart Contracts',
    description: 'Deploy a contract and create a new token on EVM chains. ERC20 standard. ',
    audited: true,
    link: 'dashboard-service',
    icon: 'icon-file',
  },
]);
</script>
