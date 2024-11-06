<template>
  <Dashboard :loading="pageLoading">
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
          :title="$t('dashboard.service.smartContracts.create')"
          :info="$t('dashboard.service.smartContracts.info')"
          icon="storage/empty"
        >
          <Btn :to="{ name: 'dashboard-service-smart-contracts-new' }">
            {{ $t('dashboard.service.smartContracts.new') }}
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

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await deployedContractStore.getDeployedContracts();
    pageLoading.value = false;

    checkUnfinishedSmartContracts();
  });
});
</script>
