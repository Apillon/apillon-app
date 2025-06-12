<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="archive ? collectionStore.archive.loading : collectionStore.loading"
    :pagination="archive ? collectionStore.archive.pagination : collectionStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page-size="
      (pz: number) => ((archive ? collectionStore.archive.pagination : collectionStore.pagination).pageSize = pz)
    "
  />
</template>

<script lang="ts" setup>
import { NDropdown } from 'naive-ui';

const props = defineProps({
  archive: { type: Boolean, default: false },
  collections: { type: Array<CollectionInterface>, default: [] },
  search: { type: String, default: '' },
});

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const { deleteItem } = useDelete();
const { availableColumns, selectedColumns, initTableColumns, handleColumnChange } = useTable(
  LsTableColumnsKeys.NFT_COLLECTION
);

/** Data: filtered collections */
const data = computed<Array<CollectionInterface>>(() => {
  return props.collections.filter(item => item.name.toLowerCase().includes(props.search.toLowerCase())) || [];
});

const columns = computed<NDataTableColumns<CollectionInterface>>(() => {
  return [
    {
      key: 'chain',
      title: t('nft.transaction.chain'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('chain') },
      ],
      minWidth: 120,
      render(row: CollectionInterface) {
        return h(resolveComponent('NftCollectionChain'), { chainId: row.chain });
      },
    },
    {
      key: 'name',
      title: t('nft.collection.name'),
      className: [
        'font-semibold',
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('name') },
      ],
    },
    {
      key: 'symbol',
      title: t('nft.collection.symbol'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('symbol') },
      ],
      render(row: CollectionInterface) {
        return h('span', { class: 'uppercase !text-white-terciary' }, { default: () => row.symbol });
      },
    },
    {
      key: 'collection_uuid',
      title: t('nft.collection.uuid'),
      className: { hidden: !selectedColumns.value.includes('collection_uuid') },
      show: false,
      render(row: CollectionInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.collection_uuid }, '');
      },
    },
    {
      key: 'contractAddress',
      title: t('nft.collection.contractAddress'),
      className: { hidden: !selectedColumns.value.includes('contractAddress') },
      render(row: CollectionInterface) {
        if (!row.contractAddress) return '';

        return h(
          resolveComponent('TableLink'),
          { link: contractLink(row.contractAddress, row.chain), text: truncateWallet(row.contractAddress) },
          ''
        );
      },
    },
    {
      key: 'baseUri',
      title: t('nft.collection.baseUri'),
      minWidth: 120,
      className: { hidden: !selectedColumns.value.includes('baseUri') },
      show: false,
      render(row: CollectionInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.baseUri }, '');
      },
    },
    {
      key: 'dropPrice',
      title: t('nft.collection.dropPrice'),
      show: false,
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('dropPrice') },
      ],
    },
    {
      key: 'dropReserve',
      title: t('nft.collection.dropReserve'),
      show: false,
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('dropReserve') },
      ],
    },
    {
      key: 'maxSupply',
      title: t('nft.collection.maxSupply'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('maxSupply') },
      ],
      render(row: CollectionInterface) {
        return h('span', {}, { default: () => maxSupply(row.maxSupply) });
      },
    },
    {
      key: 'collectionStatus',
      title: t('general.status'),
      className: { hidden: !selectedColumns.value.includes('collectionStatus') },
      render(row) {
        return h(resolveComponent('NftCollectionStatus'), { status: row.collectionStatus }, '');
      },
    },
    {
      key: 'dropStart',
      title: t('nft.collection.dropStart'),
      className: { hidden: !selectedColumns.value.includes('dropStart') },
      show: false,
      render(row: CollectionInterface) {
        if (row.drop) {
          return h('span', {}, { default: () => timestampToDateAndTime(row.dropStart) });
        }
        return '';
      },
    },
    {
      key: 'actions',
      align: 'right',
      className: '!py-0 !sticky right-0',
      filter: 'default',
      filterOptionValue: null,
      render() {
        return h(
          NDropdown,
          {
            options: props.archive ? dropdownOptionsArchive : dropdownOptions,
            trigger: 'click',
          },
          {
            default: () => h(resolveComponent('BtnActions')),
          }
        );
      },
      renderFilterIcon: () => {
        return h('span', { class: 'icon-more' }, '');
      },
      renderFilterMenu: () => {
        return h(
          resolveComponent('TableColumns'),
          {
            key: selectedColumns.value.length,
            model: selectedColumns.value,
            columns: availableColumns.value,
            onColumnChange: handleColumnChange,
          },
          ''
        );
      },
    },
  ];
});
const rowKey = (row: CollectionInterface) => row.collection_uuid;
const currentRow = ref<CollectionInterface>(props.collections[0]);

const dropdownOptions = [
  {
    key: 'collectionView',
    label: t('general.view'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        router.push(`/dashboard/service/nft/${currentRow.value.collection_uuid}`);
      },
    },
  },
  {
    key: 'collectionDelete',
    label: t('general.archive'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        deleteCollection();
      },
    },
  },
];

const dropdownOptionsArchive = [
  {
    key: 'collectionRestore',
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        restoreCollection();
      },
    },
  },
];

onMounted(() => {
  initTableColumns(columns.value);
});

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
  return maxSupply > 0 ? maxSupply : '∞';
}

async function deleteCollection() {
  if (await deleteItem(ItemDeleteKey.COLLECTION, currentRow.value.collection_uuid)) {
    collectionStore.items = collectionStore.items.filter(
      item => item.collection_uuid !== currentRow.value.collection_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);
    sessionStorage.removeItem(LsCacheKeys.COLLECTION_ARCHIVE);
  }
}

/**
 * Restore collection
 * */
async function restoreCollection() {
  collectionStore.loading = true;

  try {
    await $api.patch<CollectionResponse>(endpoints.collectionActivate(currentRow.value.collection_uuid));

    collectionStore.archive.items = collectionStore.archive.items.filter(
      item => item.collection_uuid !== currentRow.value.collection_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.COLLECTIONS);
    sessionStorage.removeItem(LsCacheKeys.COLLECTION_ARCHIVE);

    message.success(t('form.success.restored.collection'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  collectionStore.loading = false;
}
</script>
