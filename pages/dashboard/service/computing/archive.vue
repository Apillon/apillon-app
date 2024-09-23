<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderComputing />
    </template>
    <slot>
      <n-space v-if="contractStore.hasContractArchive" class="pb-8" :size="32" vertical>
        <ActionsComputingContract archive />
        <TableComputingContract :contracts="contractStore.archive" archive />
      </n-space>
      <Empty
        v-else
        :title="$t('computing.contract.emptyArchive')"
        :info="$t('computing.contract.emptyArchiveInfo')"
        icon="storage/empty"
      >
        <Btn type="primary" @click="$router.push({ name: 'dashboard-service-computing' })">
          {{ $t('computing.contract.list') }}
        </Btn>
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const contractStore = useContractStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.computing'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await contractStore.getContractArchive();

      pageLoading.value = false;
    });
  }, 100);
});
</script>
