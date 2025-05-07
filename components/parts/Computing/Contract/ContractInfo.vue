<template>
  <div class="mx-auto max-w-xl">
    <div class="text-center">
      <h2>{{ contractStore.active.name }}</h2>
      <p>{{ contractStore.active.description }}</p>
    </div>
    <TableInfo :data="data" />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const contractStore = useContractStore();

const data = computed(() => {
  return [
    {
      label: t('computing.contract.address'),
      value: contractStore.active?.contractAddress,
      copy: true,
    },
    {
      label: t('computing.contract.uuid'),
      value: contractStore.active?.contract_uuid,
      copy: true,
    },
    {
      label: t('computing.contract.status'),
      value: ContractStatus[contractStore.active?.contractStatus],
    },
    {
      label: t('form.label.contract.nftContractAddress'),
      value: contractStore.active?.data?.nftContractAddress,
      copy: true,
    },
    {
      label: t('form.label.contract.nftChainRpcUrl'),
      value: contractStore.active?.data?.nftChainRpcUrl,
      copy: true,
    },
  ];
});
</script>
