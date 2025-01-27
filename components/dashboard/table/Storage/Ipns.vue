<template>
  <n-data-table
    v-bind="$attrs"
    ref="tableRef"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="ipnsStore.loading"
    :pagination="{
      ...ipnsStore.pagination,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="handlePageChange"
    @update:sorter="handleSorterChange"
    remote
  />

  <!-- Modal - Edit IPNS -->
  <modal v-model:show="modalEditIpnsVisible" :title="$t('storage.ipns.edit')">
    <FormStorageIpns
      :ipns-uuid="currentRow?.ipns_uuid"
      @submit-success="modalEditIpnsVisible = false"
    />
  </modal>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="modalDeleteIpnsVisible" :title="$t('storage.ipns.delete')">
    <FormDelete :id="currentRow?.ipns_uuid" type="ipns" @submit-success="onIpnsDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import type { DataTableInst, DataTableSortState } from 'naive-ui';
import { NButton, NDropdown } from 'naive-ui';

const $i18n = useI18n();
const ipnsStore = useIpnsStore();
const bucketStore = useBucketStore();

const tableRef = ref<DataTableInst | null>(null);
const currentRow = ref<IpnsInterface>({} as IpnsInterface);
const sort = ref<DataTableSortState | null | undefined>();
const modalEditIpnsVisible = ref<boolean>(false);
const modalDeleteIpnsVisible = ref<boolean>(false);

const TableColumns = resolveComponent('TableColumns');
const TableEllipsis = resolveComponent('TableEllipsis');
const TableLink = resolveComponent('TableLink');

/** Available columns - show/hide column */
const selectedColumns = ref([
  'name',
  'ipns_uuid',
  'description',
  'ipnsName',
  'ipnsValue',
  'createTime',
]);
const availableColumns = ref([
  { value: 'name', label: $i18n.t('general.name') },
  { value: 'ipns_uuid', label: $i18n.t('storage.ipns.uuid') },
  { value: 'description', label: $i18n.t('storage.ipns.description') },
  { value: 'ipnsName', label: $i18n.t('storage.ipns.ipnsName') },
  { value: 'ipnsValue', label: $i18n.t('storage.ipns.link') },
  { value: 'createTime', label: $i18n.t('dashboard.createTime') },
  { value: 'updateTime', label: $i18n.t('general.updateTime') },
]);

/** Columns */
const columns = computed<NDataTableColumns<IpnsInterface>>(() => {
  return [
    {
      key: 'name',
      title: $i18n.t('storage.ipns.name'),
      minWidth: 100,
      className: { hidden: !selectedColumns.value.includes('name') },
    },
    {
      key: 'ipns_uuid',
      title: $i18n.t('storage.ipns.uuid'),
      render(row: IpnsInterface) {
        return h(TableEllipsis, { text: row.ipns_uuid }, '');
      },
    },
    {
      key: 'description',
      title: $i18n.t('storage.ipns.description'),
      className: { hidden: !selectedColumns.value.includes('description') },
    },
    {
      key: 'ipnsName',
      title: $i18n.t('storage.ipns.ipnsName'),
      className: { hidden: !selectedColumns.value.includes('ipnsName') },
      render(row: IpnsInterface) {
        return h(TableEllipsis, { text: row.ipnsName }, '');
      },
    },
    {
      key: 'ipnsValue',
      title: $i18n.t('storage.ipns.link'),
      className: { hidden: !selectedColumns.value.includes('ipnsValue') },
      render(row: IpnsInterface) {
        return h(TableLink, { link: row.link }, '');
      },
    },
    {
      key: 'createTime',
      title: $i18n.t('dashboard.createTime'),
      className: { hidden: !selectedColumns.value.includes('createTime') },
      render(row: IpnsInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
      },
    },
    {
      key: 'updateTime',
      title: $i18n.t('general.updateTime'),
      className: { hidden: !selectedColumns.value.includes('updateTime') },
      render(row: IpnsInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.updateTime || '') });
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
      filter: 'default',
      filterOptionValue: null,
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
          TableColumns,
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
const rowKey = (row: IpnsInterface) => row.ipns_uuid;

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.IPNS, JSON.stringify(selectedColumns.value));
}

/** Dropdown options for files */
const dropdownOptions = [
  {
    key: 'edit',
    label: $i18n.t('general.edit'),
    props: {
      onClick: () => {
        modalEditIpnsVisible.value = true;
      },
    },
  },
  {
    key: 'delete',
    label: $i18n.t('general.delete'),
    props: {
      class: '!text-pink',
      onClick: () => {
        modalDeleteIpnsVisible.value = true;
      },
    },
  },
];

function rowProps(row: IpnsInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** Data: filtered files */
const data = computed<Array<IpnsInterface>>(() => {
  return (
    ipnsStore.items.filter(item =>
      item.name.toLowerCase().includes(ipnsStore.search.toLowerCase())
    ) || []
  );
});

onMounted(() => {
  /** Check if selected columns are stored in LS */
  if (localStorage.getItem(LsTableColumnsKeys.IPNS)) {
    selectedColumns.value = JSON.parse(localStorage.getItem(LsTableColumnsKeys.IPNS) || '');
  }
});

/** Sort column - fetch directory content with order params  */
async function handleSorterChange(sorter?: DataTableSortState) {
  sort.value = sorter && sorter.order !== false ? sorter : null;
  if (sorter) {
    await getIpns();
  }
}

/** Reset sort if user search change directory or search directory content */
function clearSorter() {
  if (tableRef.value) {
    tableRef.value.sort(0, false);
  }
}

/** On page change, load data */
async function handlePageChange(currentPage: number) {
  if (!ipnsStore.loading) {
    await getIpns(currentPage);
  }
}

/** Search folders and files */
watch(
  () => ipnsStore.search,
  _ => {
    if (ipnsStore.allowFetch) {
      debouncedSearchFilter();
      clearSorter();
    }
  }
);
const debouncedSearchFilter = useDebounceFn(getIpns, 500);

/** Function "Fetch directory content" wrapper  */
async function getIpns(page = 1) {
  await ipnsStore.fetchIpns(bucketStore.bucketUuid, {
    page,
    limit: ipnsStore.pagination.pageSize,
    search: ipnsStore.search,
    orderBy: sort.value ? `${sort.value.columnKey}` : undefined,
    order: sort.value ? `${sort.value.order}` : undefined,
  });
}

/**
 * Delete Ipns
 */
function onIpnsDeleted() {
  modalDeleteIpnsVisible.value = false;
  ipnsStore.items = ipnsStore.items.filter(item => item.ipns_uuid !== currentRow.value.ipns_uuid);
}
</script>
