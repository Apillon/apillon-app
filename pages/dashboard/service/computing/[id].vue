<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderContract />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsComputingContract
          @mint="modalMintContractVisible = true"
          @nest-mint="modalNestMintContractVisible = true"
          @revoke="modalBurnTokensVisible = true"
          @transfer="modalTransferOwnershipVisible = true"
        />
      </n-space>

      <!-- Modal - Contract Mint
      <modal v-model:show="modalMintContractVisible" :title="$t('nft.contract.mint')">
        <FormComputingMint
          :contract-uuid="contractStore.active.contract_uuid"
        />
      </modal> -->

      <!-- Modal - Contract Transfer
      <modal v-model:show="modalTransferOwnershipVisible" :title="$t('nft.contract.transfer')">
        <FormComputingTransfer
          :contract-uuid="contractStore.active.contract_uuid"
        />
      </modal> -->
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
const modalMintContractVisible = ref<boolean | null>(false);
const modalNestMintContractVisible = ref<boolean | null>(false);
const modalBurnTokensVisible = ref<boolean | null>(false);
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
