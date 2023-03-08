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
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

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
      key: 'mintPrice',
      title: $i18n.t('nft.collection.mintPrice'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'reserve',
      title: $i18n.t('nft.collection.reserve'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'maxSupply',
      title: $i18n.t('nft.collection.minted') + '/' + $i18n.t('nft.collection.maxSupply'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row: CollectionInterface) {
        return h('span', {}, { default: () => row.minted + '/' + row.maxSupply });
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
        router.push({ path: `/dashboard/service/nft/${row.id}` });
      }
    },
  };
};
</script>
