<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="indexerStore.items"
    :loading="indexerStore.loading"
    :pagination="indexerStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    remote
    @update:page="(page: number) => handlePageChange(page, indexerStore.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
  />
  <!-- Modal - Update Indexer -->
  <modal v-model:show="showModalEditIndexer" :title="$t('indexer.update')">
    <FormIndexer
      :indexer-uuid="currentRow.indexer_uuid"
      @submit-success="showModalEditIndexer = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const indexerStore = useIndexerStore();
const dataStore = useDataStore();
const authStore = useAuthStore();
const showModalEditIndexer = ref<boolean | null>(false);
const message = useMessage();
const $i18n = useI18n();

const rowKey = (row: IndexerBaseInterface) => row.indexer_uuid;
const currentRow = ref<IndexerBaseInterface>(indexerStore.items[0]);

const columns = computed(() => [
  {
    key: 'name',
    title: t('dashboard.service.indexer.table.name'),
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    render(row) {
      return h('strong', {}, { default: () => row.name });
    },
  },
  {
    key: 'indexer_uuid',
    title: t('dashboard.service.indexer.table.uuid'),
    render(row: IndexerBaseInterface) {
      return h(resolveComponent('TableEllipsis'), { text: row.indexer_uuid }, '');
    },
  },
  {
    key: 'description',
    title: t('dashboard.service.indexer.table.description'),
    className: ON_COLUMN_CLICK_OPEN_CLASS,
    render(row) {
      return h('strong', {}, { default: () => row.description });
    },
  },
  {
    key: 'createTime',
    title: t('dashboard.createTime'),
    render(row: IndexerBaseInterface) {
      return h('span', {}, { default: () => dateTimeToDateAndTime(row.createTime || '') });
    },
  },
  {
    key: 'status',
    title: t('dashboard.service.indexer.table.status'),
    render(row: IndexerBaseInterface) {
      return h(resolveComponent('IndexerStatusLabel'), { indexerStatus: row.status }, '');
    },
  },
  {
    key: 'actions',
    title: '',
    align: 'right',
    className: '!py-0 !sticky right-0',
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
  },
]);
/** On row click */
const rowProps = (row: IndexerBaseInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/indexing/${row.indexer_uuid}` });
      }
    },
  };
};

const dropdownOptions = [
  {
    key: 'indexerEdit',
    label: t('general.edit'),
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        showModalEditIndexer.value = true;
      },
    },
  },
  {
    key: 'hostingDelete',
    label: t('general.delete'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        deleteIndexer();
      },
    },
  },
];

/** Search posts */
watch(
  () => indexerStore.search,
  _ => {
    indexerStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(handlePageChange, 500);

async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  await indexerStore.fetchIndexers(page, limit);
  indexerStore.pagination.page = page;
  indexerStore.pagination.pageSize = limit;
}

async function deleteIndexer() {
  await indexerStore.deleteIndexer(currentRow.value.indexer_uuid);
  message.success($i18n.t('form.success.deleted.indexer'));
}
</script>
