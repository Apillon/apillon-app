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
          v-if="deployedSmartContracts"
          :contracts="deployedSmartContracts.items"
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
const dataStore = useDataStore();
const smartContractsStore = useSmartContractsStore();
const $i18n = useI18n();

useHead({
  title: $i18n.t('dashboard.nav.smartContracts'),
});
const pageLoading = ref<boolean>(true);

const deployedSmartContracts = ref<SmartContractInterface[]>([]);

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const projectUuid = dataStore.currentProject?.project_uuid;
    await smartContractsStore.fetchContractsPerProject(projectUuid);

    deployedSmartContracts.value = smartContractsStore.getContractsPerProject;
    pageLoading.value = false;
  });
});
</script>
