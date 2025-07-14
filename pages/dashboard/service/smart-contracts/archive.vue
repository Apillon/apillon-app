<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContracts />
      </div>
    </template>
    <slot>
      <div class="pb-8">
        <n-space v-show="deployedContractStore.showDeployedContractsArchive" :size="32" vertical>
          <ActionsSmartContracts archive />
          <TableSmartContracts :contracts="deployedContractStore.archive.items" archive />
        </n-space>
        <Empty
          v-show="!deployedContractStore.showDeployedContractsArchive"
          :title="$t('smartContracts.emptyArchive')"
          :info="$t('smartContracts.emptyArchiveInfo')"
          icon="storage/empty"
        >
        </Empty>
      </div>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const deployedContractStore = useDeployedContractStore();

useHead({
  title: t('dashboard.nav.smartContracts'),
});
const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await dataStore.waitOnPromises();
  await deployedContractStore.getDeployedContractsArchive();
  pageLoading.value = false;
});
</script>
