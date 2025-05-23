<template>
  <Dashboard :empty="!dataStore.project.selected || !deployedContractStore.hasDeployedContracts" :loading="pageLoading">
    <template #empty>
      <ServiceEmpty
        :name="toCamelCase(Feature.SMART_CONTRACTS)"
        :service="ServiceTypeName.SMART_CONTRACTS"
        docs="https://wiki.apillon.io/web3-services/12-web3-smart-contracts.html"
      >
        <template #actions>
          <Btn size="large" :to="{ name: 'dashboard-service-smart-contracts-new' }">
            {{ $t('smartContracts.new') }}
          </Btn>
        </template>
      </ServiceEmpty>
    </template>
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContracts />
      </div>
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <ActionsSmartContracts />
      <TableSmartContracts :contracts="deployedContractStore.items" />
    </n-space>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const deployedContractStore = useDeployedContractStore();
const { checkUnfinishedSmartContracts } = useSmartContracts();

useHead({
  title: t('dashboard.nav.smartContracts'),
});
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await dataStore.waitOnPromises();
  await deployedContractStore.getDeployedContracts();
  pageLoading.value = false;

  checkUnfinishedSmartContracts();
});
</script>
