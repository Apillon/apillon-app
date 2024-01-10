<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderContract>
        <template #info>
          <ActionsComputingContract @transfer="modalTransferOwnershipVisible = true" />
        </template>
      </HeaderContract>
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <ComputingContractTabs />
      </n-space>

      <!-- Modal - Contract Transfer -->
      <modal
        v-model:show="modalTransferOwnershipVisible"
        :title="$t('computing.contract.transfer')"
      >
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
const $i18n = useI18n();
const dataStore = useDataStore();
const contractStore = useContractStore();

const pageLoading = ref<boolean>(true);
const modalTransferOwnershipVisible = ref<boolean | null>(false);

/** Contract UUID from route */
const contractUuid = ref<string>(`${params?.id}` || `${params?.slug}` || '');

useHead({
  title: $i18n.t('dashboard.nav.nft'),
});

onMounted(() => {
  contractStore.getContract(contractUuid.value);

  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const currentContract = await contractStore.getContract(contractUuid.value);

    if (!currentContract?.contract_uuid) {
      router.push({ name: 'dashboard-service-nft' });
    } else {
      contractStore.active = currentContract;

      pageLoading.value = false;
    }
  });
});
</script>
