<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsNftCollection archive />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="collectionStore.loading"
      :pagination="{
        pageSize: PAGINATION_LIMIT,
        prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
      }"
      :row-key="rowKey"
      :row-props="rowProps"
    />

    <!-- Modal - Archive website -->
    <ModalDelete v-model:show="showModalArchiveCollection" :title="$t('nft.collection.delete')">
      <template #content>
        <p>
          {{ $t('nft.collection.deleteConfirm') }}
        </p>
      </template>

      <slot>
        <FormDeleteItems :items="[currentRow]" @submit-success="onCollectionDeleted()" />
      </slot>
    </ModalDelete>

    <!-- W3Warn: delete website -->
    <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnHide">
      {{ $t('w3Warn.nft.delete') }}
    </W3Warn>
  </n-space>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  collections: { type: Array<CollectionInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t, te } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.COLLECTION_DELETE);

const showModalArchiveCollection = ref<boolean | null>(false);
const NftCollectionStatus = resolveComponent('NftCollectionStatus');
const TableEllipsis = resolveComponent('TableEllipsis');
const TableLink = resolveComponent('TableLink');

/** Available columns - show/hide column */
const selectedColumns = ref([
  'chain',
  'symbol',
  'name',
  'type',
  'collection_uuid',
  'contractAddress',
  'baseUri',
  'dropPrice',
  'dropReserve',
  'maxSupply',
  'collectionStatus',
  'dropStart',
]);
const availableColumns = ref([
  { value: 'chain', label: t('nft.transaction.chain') },
  { value: 'symbol', label: t('nft.collection.symbol') },
  { value: 'name', label: t('nft.collection.name') },
  { value: 'type', label: t('general.type') },
  { value: 'collection_uuid', label: t('nft.collection.uuid') },
  { value: 'contractAddress', label: t('nft.collection.contractAddress') },
  { value: 'baseUri', label: t('nft.collection.baseUri') },
  { value: 'dropPrice', label: t('nft.collection.dropPrice') },
  { value: 'dropReserve', label: t('nft.collection.dropReserve') },
  { value: 'maxSupply', label: t('nft.collection.maxSupply') },
  { value: 'collectionStatus', label: t('general.status') },
  { value: 'dropStart', label: t('nft.collection.dropStart') },
]);

/** Data: filtered collections */
const data = computed<Array<CollectionInterface>>(() => {
  return (
    props.collections.filter(item =>
      item.name.toLocaleLowerCase().includes(collectionStore.search.toLocaleLowerCase())
    ) || []
  );
});

const columns = computed<NDataTableColumns<CollectionInterface>>(() => {
  return [
    {
      key: 'chain',
      title: t('nft.transaction.chain'),
      className: [
        { ON_COLUMN_CLICK_OPEN_CLASS: !props.archive },
        { hidden: !selectedColumns.value.includes('chain') },
      ],
      minWidth: 120,
      render(row: CollectionInterface) {
        return h('span', {}, { default: () => t(`nft.chain.${row.chain}`) });
      },
    },
    {
      key: 'symbol',
      title: t('nft.collection.symbol'),
      className: [
        { ON_COLUMN_CLICK_OPEN_CLASS: !props.archive },
        { hidden: !selectedColumns.value.includes('symbol') },
      ],
      render(row) {
        return h('strong', {}, { default: () => row.symbol });
      },
    },
    {
      key: 'name',
      title: t('nft.collection.name'),
      className: [
        { ON_COLUMN_CLICK_OPEN_CLASS: !props.archive },
        { hidden: !selectedColumns.value.includes('name') },
      ],
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'type',
      title: t('general.type'),
      minWidth: 100,
      className: [
        { ON_COLUMN_CLICK_OPEN_CLASS: !props.archive },
        { hidden: !selectedColumns.value.includes('type') },
      ],
      render(row) {
        if (row.collectionType) {
          return t(`nft.collection.type.${row.collectionType}`);
        } else {
          return t(`nft.collection.type.${NFTCollectionType.GENERIC}`);
        }
      },
    },
    {
      key: 'collection_uuid',
      title: t('nft.collection.uuid'),
      className: { hidden: !selectedColumns.value.includes('collection_uuid') },
      render(row: CollectionInterface) {
        return h(TableEllipsis, { text: row.collection_uuid }, '');
      },
    },
    {
      key: 'contractAddress',
      title: t('nft.collection.contractAddress'),
      className: { hidden: !selectedColumns.value.includes('contractAddress') },
      render(row: CollectionInterface) {
        if (!row.contractAddress) return '';

        return h(
          TableLink,
          { link: contractLink(row.contractAddress, row.chain), text: row.contractAddress },
          ''
        );
      },
    },
    {
      key: 'baseUri',
      title: t('nft.collection.baseUri'),
      className: { hidden: !selectedColumns.value.includes('baseUri') },
      render(row: CollectionInterface) {
        return h(TableEllipsis, { text: row.baseUri }, '');
      },
    },
    {
      key: 'dropPrice',
      title: t('nft.collection.dropPrice'),
      className: [
        { ON_COLUMN_CLICK_OPEN_CLASS: !props.archive },
        { hidden: !selectedColumns.value.includes('dropPrice') },
      ],
    },
    {
      key: 'dropReserve',
      title: t('nft.collection.dropReserve'),
      className: [
        { ON_COLUMN_CLICK_OPEN_CLASS: !props.archive },
        { hidden: !selectedColumns.value.includes('dropReserve') },
      ],
    },
    {
      key: 'maxSupply',
      title: t('nft.collection.maxSupply'),
      className: [
        { ON_COLUMN_CLICK_OPEN_CLASS: !props.archive },
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
        return h(NftCollectionStatus, { collectionStatus: row.collectionStatus }, '');
      },
    },
    {
      key: 'dropStart',
      title: t('nft.collection.dropStart'),
      className: { hidden: !selectedColumns.value.includes('dropStart') },
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
      className: '!sticky right-0',
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
            default: () =>
              h(
                NButton,
                { type: 'tertiary', size: 'small', quaternary: true, round: true },
                { default: () => h('span', { class: 'icon-more text-2xl' }, {}) }
              ),
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
    key: 'collectionDelete',
    label: t('general.archive'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
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
      class: '!text-pink',
      onClick: () => {
        restoreCollection();
      },
    },
  },
];

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

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.NFT_COLLECTION, JSON.stringify(selectedColumns.value));
}

function maxSupply(maxSupply: number) {
  return maxSupply > 0 ? maxSupply : t('form.supplyTypes.unlimited');
}

/**
 * On deleteCollection click
 * If W3Warn has already been shown, show modal delete collection, otherwise show warn first
 * */
function deleteCollection() {
  if (localStorage.getItem(LsW3WarnKeys.COLLECTION_DELETE) || !te('w3Warn.nft.delete')) {
    showModalArchiveCollection.value = true;
  } else {
    modalW3WarnVisible.value = true;
    showModalArchiveCollection.value = null;
  }
}

/** When user close W3Warn, allow him to create new collection */
function onModalW3WarnHide() {
  if (showModalArchiveCollection.value !== false) {
    showModalArchiveCollection.value = true;
  }
}

/**
 * On collection deleted
 * Hide modal and refresh collection list
 * */
function onCollectionDeleted() {
  showModalArchiveCollection.value = false;

  collectionStore.items = collectionStore.items.filter(
    item => item.collection_uuid !== currentRow.value.collection_uuid
  );

  sessionStorage.removeItem(LsCacheKeys.COLLECTION);
  sessionStorage.removeItem(LsCacheKeys.COLLECTION_ARCHIVE);
}

/**
 * Restore collection
 * */
async function restoreCollection() {
  collectionStore.loading = true;

  try {
    await $api.patch<CollectionResponse>(
      endpoints.collectionActivate(currentRow.value.collection_uuid)
    );

    collectionStore.archive = collectionStore.archive.filter(
      item => item.collection_uuid !== currentRow.value.collection_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.COLLECTION);
    sessionStorage.removeItem(LsCacheKeys.COLLECTION_ARCHIVE);

    message.success(t('form.success.restored.collection'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  collectionStore.loading = false;
}
</script>
