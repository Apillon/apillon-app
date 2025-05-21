<template>
  <ServiceEmpty
    v-if="!dataStore.project.selected"
    :name="toCamelCase(Feature.SMART_CONTRACTS)"
    :service="ServiceTypeName.SMART_CONTRACTS"
    docs="https://wiki.apillon.io/web3-services/12-web3-smart-contracts.html"
  />
  <Dashboard v-else :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContracts />
      </div>
    </template>
    <slot>
      <div class="pb-8">
        <n-space v-show="deployedContractStore.showDeployedContracts" :size="32" vertical>
          <ActionsSmartContracts />
          <TableSmartContracts :contracts="deployedContractStore.items" />
        </n-space>
        <Empty
          v-show="!deployedContractStore.showDeployedContracts"
          :title="$t('smartContracts.create')"
          :info="$t('smartContracts.info')"
          icon="storage/empty"
        >
          <Btn :to="{ name: 'dashboard-service-smart-contracts-new' }">
            {{ $t('smartContracts.new') }}
          </Btn>
        </Empty>
      </div>
    </slot>
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
