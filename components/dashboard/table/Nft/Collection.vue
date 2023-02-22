<template>
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
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  collections: { type: Array<CollectionInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const collectionStore = useCollectionStore();
const settingsStore = useSettingsStore();
const modalEditCollectionVisible = ref<boolean>(false);
const CollectionStatus = resolveComponent('CollectionStatus');

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
        if (!row.collection_uuid) {
          return '';
        }
        return [
          h(
            'div',
            { class: 'flex' },
            {
              default: () => [
                h(
                  NEllipsis,
                  { class: 'text-body align-bottom', 'line-clamp': 1 },
                  { default: () => row.collection_uuid }
                ),
                h(
                  'button',
                  { class: 'ml-2', onClick: () => copyToClipboard(row.collection_uuid) },
                  h('span', { class: 'icon-copy text-body' }, {})
                ),
              ],
            }
          ),
        ];
      },
    },
    {
      key: 'mintPrice',
      title: $i18n.t('nft.collection.mintPrice'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'maxSupply',
      title: $i18n.t('nft.collection.maxSupply'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'status',
      title: $i18n.t('general.status'),
      render(row) {
        return h(CollectionStatus, { collectionStatus: row.status }, '');
      },
    },
    {
      key: 'actions',
      title: $i18n.t('general.actions'),
      align: 'right',
      className: '!py-0',
      render() {
        return h(
          NDropdown,
          {
            options: dropdownOptions,
            trigger: 'click',
          },
          {
            default: () =>
              h(
                NButton,
                { size: 'small', quaternary: true },
                { default: () => h('span', { class: 'icon-more text-lg' }, {}) }
              ),
          }
        );
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: BucketItemInterface) => row.id;
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

const dropdownOptions = [
  {
    label: $i18n.t('storage.edit'),
    key: 'storageEdit',
    disabled: settingsStore.isProjectUser(),
    props: {
      onClick: () => {
        modalEditCollectionVisible.value = true;
      },
    },
  },
];
</script>
