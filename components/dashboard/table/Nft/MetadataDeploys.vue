<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="collectionStore.loading"
    :pagination="{ pageSize: PAGINATION_LIMIT }"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  deploys: { type: Array<MetadataDeployInterface>, default: [] },
});

const { t } = useI18n();
const collectionStore = useCollectionStore();
const { tableRowCreateTime, tableRowUpdateTime } = useTable();

/** Data: filtered deploys */
const data = computed<Array<MetadataDeployInterface>>(() => {
  return (
    props.deploys.filter(item => JSON.stringify(item).toLowerCase().includes(collectionStore.search.toLowerCase())) ||
    []
  );
});

const createColumns = (): NDataTableColumns<MetadataDeployInterface> => {
  return [
    tableRowCreateTime,
    tableRowUpdateTime,
    {
      key: 'currentStep',
      title: t('nft.metadata.currentStep'),
      render(row: MetadataDeployInterface) {
        return h(resolveComponent('NftMetadataDeployStatus'), { status: row.currentStep }, '');
      },
    },
    {
      key: 'lastError',
      title: t('nft.metadata.lastError'),
    },
  ];
};
const columns = createColumns();
</script>
