<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSmartContractsSecondary />
    </template>

    <slot>
      <div class="pb-8">
        <div class="max-w-lg mb-8">
          <p>{{ $t('dashboard.smartContracts.description') }}</p>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <SmartContractsCard v-for="(contract, key) in smartContracts" :key="key">
            <div class="flex items-center gap-2 mb-4 text-green">
              <span class="icon-security"></span> Audited
            </div>
            <div class="flex items-center gap-2 mb-4">
              <span class="text-2xl icon-file"></span>
              <h5>{{ contract.name }}</h5>
            </div>
            <p>{{ contract.description }}</p>
            <Btn
              type="secondary"
              class="mt-8"
              :to="`/dashboard/service/smart-contracts/${contract.contract_uuid}`"
            >
              {{ $t('dashboard.smartContracts.createNew') }}
            </Btn>
          </SmartContractsCard>
        </div>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const dataStore = useDataStore();
const smartContractsStore = useSmartContractsStore();
const $i18n = useI18n();

const headingRef = ref<HTMLElement>();

const smartContracts = ref<SmartContractInterface[]>([]);

useHead({
  title: $i18n.t('dashboard.nav.smartContracts'),
});
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await sleep(500);
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    /** Fetch all services if there is any service type unloaded */
    await smartContractsStore.getContracts();

    smartContracts.value = smartContractsStore.getAllContracts;

    pageLoading.value = false;
  });
});
</script>
