<template>
  <div class="max-w-xl mx-auto">
    <div class="text-center">
      <h2>{{ contractStore.active.name }}</h2>
      <p>{{ contractStore.active.description }}</p>
    </div>
    <n-table class="plain" :bordered="false" single-line>
      <tbody>
        <tr v-for="(item, key) in data" :key="key">
          <td>
            <span class="text-white lg:whitespace-nowrap">{{ item.label }}</span>
          </td>
          <td>
            <TableEllipsis v-if="item.value" :text="item.value" />
            <span v-else>{{ item.text }}</span>
          </td>
        </tr>
      </tbody>
    </n-table>
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
    },
    {
      label: t('computing.contract.uuid'),
      value: contractStore.active?.contract_uuid,
    },
    {
      label: t('computing.contract.status'),
      text: ContractStatus[contractStore.active?.contractStatus],
    },
    {
      label: t('form.label.contract.nftContractAddress'),
      value: contractStore.active?.data?.nftContractAddress,
    },
    {
      label: t('form.label.contract.nftChainRpcUrl'),
      value: contractStore.active?.data?.nftChainRpcUrl,
    },
  ];
});
</script>
