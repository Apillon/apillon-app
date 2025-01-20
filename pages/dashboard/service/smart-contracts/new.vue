<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContract />
    </template>

    <slot>
      <div class="pb-8">
        <div class="mb-8 max-w-lg">
          <p>{{ $t('dashboard.service.smartContracts.description2') }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-services">
          <SmartContractsCard v-for="(contract, key) in smartContractStore.items" :key="key">
            <div class="mb-4 flex items-center gap-2 text-green">
              <span class="icon-security"></span>
              {{ $t('dashboard.service.smartContracts.audited') }}
            </div>
            <div class="mb-4 flex items-center gap-2">
              <span class="icon-file text-2xl"></span>
              <h5>{{ contract.name }}</h5>
            </div>
            <p>{{ contract.description }}</p>
            <Btn
              type="secondary"
              class="mt-8"
              size="large"
              :to="`/dashboard/service/smart-contracts/${contract.contract_uuid}`"
            >
              {{ $t('dashboard.service.smartContracts.new') }}
            </Btn>
          </SmartContractsCard>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const smartContractStore = useSmartContractStore();
const $i18n = useI18n();

useHead({
  title: $i18n.t('dashboard.nav.smartContracts'),
});
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await sleep(500);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    /** Fetch all services if there is any service type unloaded */
    await smartContractStore.getSmartContracts();

    pageLoading.value = false;
  });
});
</script>
