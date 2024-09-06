<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <div ref="headingRef">
        <HeaderSmartContracts />
      </div>
    </template>
    <slot>
      <div class="pb-8">
        <TableSmartContractsTable
          v-if="deployedContractStore.hasDeployedContracts"
          :contracts="deployedContractStore.items"
        />
        <Empty
          v-else
          :title="$t('dashboard.service.smartContracts.create')"
          :info="$t('dashboard.service.smartContracts.info')"
          icon="storage/empty"
        >
          <NuxtLink
            class="flex items-center gap-x-2"
            :to="{ name: 'dashboard-service-smart-contracts' }"
          >
            <h4>{{ $t('dashboard.service.smartContracts.new') }}</h4>
          </NuxtLink>
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

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await deployedContractStore.getDeployedContracts();

    pageLoading.value = false;
  });
});
</script>
