<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderComputingContract />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ActionsComputingTransaction :show-upload="showUpload" @transfer="modalTransferOwnershipVisible = true" />

        <!-- Display Contract data -->
        <ComputingContractInfo class="mb-8" />

        <TableComputingTransaction :contract-uuid="contractStore.active.contract_uuid" />

        <ComputingSchrodingerTemplate />
      </n-space>

      <!-- Modal - Contract Transfer -->
      <modal v-model:show="modalTransferOwnershipVisible" :title="$t('computing.contract.transfer')">
        <FormComputingTransfer
          :contract-uuid="contractStore.active.contract_uuid"
          @submit-success="modalTransferOwnershipVisible = false"
        />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const { t } = useI18n();
const dataStore = useDataStore();
const contractStore = useContractStore();
const transactionStore = useComputingTransactionStore();
const { checkUnfinishedTransactions } = useComputing();

const pageLoading = ref<boolean>(true);
const showUpload = ref<boolean>(false);
const modalTransferOwnershipVisible = ref<boolean | null>(false);

/** Contract UUID from route */
const contractUuid = ref<string>(`${params?.id}` || `${params?.slug}` || '');

useHead({
  title: t('dashboard.nav.computing'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();

  const currentContract = await contractStore.getContract(contractUuid.value);
  if (!currentContract?.contract_uuid) {
    router.push({ name: 'dashboard-service-computing' });
  } else {
    contractStore.active = currentContract;
    showUpload.value = currentContract.contractStatus === ContractStatus.DEPLOYED;
    pageLoading.value = false;

    await transactionStore.fetchTransactions(currentContract.contract_uuid, {
      page: transactionStore.pagination.page,
    });
    checkUnfinishedTransactions();
  }
});
</script>
