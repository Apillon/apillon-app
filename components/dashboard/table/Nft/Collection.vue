<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsNftCollection />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="collectionStore.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
const props = defineProps({
  collections: { type: Array<CollectionInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const collectionStore = useCollectionStore();
const NftCollectionStatus = resolveComponent('NftCollectionStatus');
const TableEllipsis = resolveComponent('TableEllipsis');

/** Data: filtered collections */
const data = computed<Array<CollectionInterface>>(() => {
  return (
    props.collections.filter(item =>
      item.name.toLocaleLowerCase().includes(collectionStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<CollectionInterface> => {
  return [
    {
      key: 'chain',
      title: $i18n.t('nft.transaction.chain'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      minWidth: 120,
      render(row: CollectionInterface) {
        return h('span', {}, { default: () => $i18n.t(`nft.chain.${row.chain}`) });
      },
    },
    {
      key: 'symbol',
      title: $i18n.t('nft.collection.symbol'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.symbol });
      },
    },
    {
      key: 'name',
      title: $i18n.t('nft.collection.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'type',
      title: $i18n.t('general.type'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        if (row.collectionType) {
          return $i18n.t(`nft.collection.type.${row.collectionType}`);
        } else {
          return $i18n.t(`nft.collection.type.${NFTCollectionType.GENERIC}`);
        }
      },
    },
    {
      key: 'collection_uuid',
      title: $i18n.t('nft.collection.uuid'),
      className: 'hidden',
      render(row: CollectionInterface) {
        return h(TableEllipsis, { text: row.collection_uuid }, '');
      },
    },
    {
      key: 'contractAddress',
      title: $i18n.t('nft.collection.contractAddress'),
      render(row: CollectionInterface) {
        return h(TableEllipsis, { text: row.contractAddress }, '');
      },
    },
    {
      key: 'dropPrice',
      title: $i18n.t('nft.collection.dropPrice'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'dropReserve',
      title: $i18n.t('nft.collection.dropReserve'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'maxSupply',
      title: $i18n.t('nft.collection.maxSupply'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row: CollectionInterface) {
        return h('span', {}, { default: () => maxSupply(row.maxSupply) });
      },
    },
    {
      key: 'collectionStatus',
      title: $i18n.t('general.status'),
      render(row) {
        return h(NftCollectionStatus, { collectionStatus: row.collectionStatus }, '');
      },
    },
    {
      key: 'dropStart',
      title: $i18n.t('nft.collection.dropStart'),
      render(row: CollectionInterface) {
        return h('span', {}, { default: () => timestampToDateAndTime(row.dropStart) });
      },
    },
    {
      key: 'updateTime',
      title: $i18n.t('general.updateTime'),
      render(row: CollectionInterface) {
        return h('span', {}, { default: () => datetimeToDateAndTime(row.updateTime || '') });
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: CollectionInterface) => row.id;
const currentRow = ref<CollectionInterface>(props.collections[0]);

/** On row click */
const rowProps = (row: CollectionInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/nft/${row.collection_uuid}` });
      }
    },
  };
};

function maxSupply(maxSupply: number) {
  return maxSupply > 0 ? maxSupply : $i18n.t('form.supplyTypes.unlimited');
}
</script>
