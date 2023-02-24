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
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  transactions: { type: Array<TransactionInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const collectionStore = useCollectionStore();
const settingsStore = useSettingsStore();
const modalEditCollectionVisible = ref<boolean>(false);
const NftCollectionStatus = resolveComponent('NftCollectionStatus');

/** Data: filtered transactions */
const data = computed<Array<TransactionInterface>>(() => {
  return (
    props.transactions.filter(item =>
      item.updateTime.toLocaleLowerCase().includes(collectionStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<TransactionInterface> => {
  return [
    {
      key: 'chainId',
      title: $i18n.t('nft.transaction.chainId'),
    },
    {
      key: 'transactionHash',
      title: $i18n.t('nft.transaction.hash'),
    },
    {
      key: 'transactionType',
      title: $i18n.t('nft.transaction.type'),
    },
    {
      key: 'transactionStatus',
      title: $i18n.t('general.status'),
      render(row) {
        return h(NftCollectionStatus, { collectionStatus: row.transactionStatus }, '');
      },
    },
    {
      key: 'actions',
      title: $i18n.t('general.actions'),
      align: 'right',
      className: '!py-0 hidden',
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
const rowKey = (row: TransactionInterface) => row.id;
const currentRow = ref<TransactionInterface>(props.transactions[0]);

/** On row click */
const rowProps = (row: TransactionInterface) => {
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
