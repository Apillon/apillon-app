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

const $i18n = useI18n();
const collectionStore = useCollectionStore();

/** Data: filtered deploys */
const data = computed<Array<MetadataDeployInterface>>(() => {
  return (
    props.deploys.filter(item =>
      JSON.stringify(item).toLowerCase().includes(collectionStore.search.toLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<MetadataDeployInterface> => {
  return [
    {
      key: 'createTime',
      title: $i18n.t('dashboard.created'),
      minWidth: 120,
      render(row: MetadataDeployInterface) {
        return h(
          'span',
          { class: 'text-sm text-body' },
          { default: () => dateTimeToDateAndTime(row.createTime || '') }
        );
      },
    },
    {
      key: 'updateTime',
      title: $i18n.t('general.updateTime'),
      render(row: MetadataDeployInterface) {
        return h(
          'span',
          { class: 'text-sm text-body' },
          { default: () => dateTimeToDateAndTime(row.updateTime || '') }
        );
      },
    },
    {
      key: 'currentStep',
      title: $i18n.t('nft.metadata.currentStep'),
      render(row: MetadataDeployInterface) {
        return h(resolveComponent('NftMetadataDeployStatus'), { status: row.currentStep }, '');
      },
    },
    {
      key: 'lastError',
      title: $i18n.t('nft.metadata.lastError'),
    },
  ];
};
const columns = createColumns();
</script>
