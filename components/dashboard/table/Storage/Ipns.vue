<template>
  <n-data-table
    v-bind="$attrs"
    ref="tableRef"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="ipnsStore.loading"
    :pagination="ipnsStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    remote
    @update:page="handlePageChange"
    @update:sorter="handleSorterChange"
  />

  <!-- Modal - Edit IPNS -->
  <modal v-model:show="modalEditIpnsVisible" :title="$t('storage.ipns.edit')">
    <FormStorageIpns :ipns-uuid="currentRow?.ipns_uuid" @submit-success="modalEditIpnsVisible = false" />
  </modal>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="modalDeleteIpnsVisible" :title="$t('storage.ipns.delete')">
    <FormDelete :id="currentRow?.ipns_uuid" type="ipns" @submit-success="onIpnsDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import type { DataTableInst, DataTableSortState } from 'naive-ui';
import { NDropdown } from 'naive-ui';

const { t } = useI18n();
const ipnsStore = useIpnsStore();
const bucketStore = useBucketStore();
const { availableColumns, selectedColumns, initTableColumns, handleColumnChange } = useTable(LsTableColumnsKeys.IPNS);

const tableRef = ref<DataTableInst | null>(null);
const currentRow = ref<IpnsInterface>({} as IpnsInterface);
const sort = ref<DataTableSortState | null | undefined>();
const modalEditIpnsVisible = ref<boolean>(false);
const modalDeleteIpnsVisible = ref<boolean>(false);

/** Columns */
const columns = computed<NDataTableColumns<IpnsInterface>>(() => {
  return [
    {
      key: 'name',
      title: t('storage.ipns.name'),
      minWidth: 100,
      className: { hidden: !selectedColumns.value.includes('name') },
    },
    {
      key: 'ipns_uuid',
      title: t('storage.ipns.uuid'),
      render(row: IpnsInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.ipns_uuid }, '');
      },
    },
    {
      key: 'description',
      title: t('storage.ipns.description'),
      className: { hidden: !selectedColumns.value.includes('description') },
    },
    {
      key: 'ipnsName',
      title: t('storage.ipns.ipnsName'),
      className: { hidden: !selectedColumns.value.includes('ipnsName') },
      render(row: IpnsInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.ipnsName }, '');
      },
    },
    {
      key: 'ipnsValue',
      title: t('storage.ipns.link'),
      className: { hidden: !selectedColumns.value.includes('ipnsValue') },
      render(row: IpnsInterface) {
        return h(resolveComponent('TableLink'), { link: row.link }, '');
      },
    },
    {
      key: 'createTime',
      title: t('dashboard.createTime'),
      className: { hidden: !selectedColumns.value.includes('createTime') },
      render(row: IpnsInterface) {
        return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
      },
    },
    {
      key: 'updateTime',
      title: t('general.updateTime'),
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
            model: selectedColumns.value,
            columns: availableColumns.value,
            onColumnChange: handleColumnChange,
          },
          ''
        );
      },
    },
  ] as NDataTableColumns<IpnsInterface>;
});
const rowKey = (row: IpnsInterface) => row.ipns_uuid;

/** Dropdown options for files */
const dropdownOptions = [
  {
    key: 'edit',
    label: t('general.edit'),
    props: {
      onClick: () => {
        modalEditIpnsVisible.value = true;
      },
    },
  },
  {
    key: 'delete',
    label: t('general.delete'),
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
  return ipnsStore.items.filter(item => item.name.toLowerCase().includes(ipnsStore.search.toLowerCase())) || [];
});

onMounted(() => {
  initTableColumns(columns.value);
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
