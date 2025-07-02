<template>
  <DataTable
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="archive ? simpletStore.archive.items : simpletStore.items"
    :loading="archive ? simpletStore.archive.loading : simpletStore.loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    remote
    @update:page="(page: number) => handlePageChange(page, pagination.pageSize)"
    @update:page-size="(pz: number) => handlePageChange(pagination.page, pz)"
  />

  <ModalDelete v-model:show="modalDeleteVisible" :title="$t('simplet.delete')">
    <FormDelete :id="currentRow.simpletDeploy_uuid" :type="ItemDeleteKey.SIMPLET" @submit-success="onDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NDropdown } from 'naive-ui';

const props = defineProps({
  archive: { type: Boolean, default: false },
  search: { type: String, default: '' },
});

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const simpletStore = useSimpletStore();

const { availableColumns, selectedColumns, tableRowCreateTime, initTableColumns, handleColumnChange } = useTable(
  LsTableColumnsKeys.SIMPLETS
);
const pagination = reactive(props.archive ? simpletStore.archive.pagination : simpletStore.pagination);

const modalDeleteVisible = ref<boolean>(false);
const rowKey = (row: SimpletInterface) => row.simpletDeploy_uuid;
const currentRow = ref<SimpletInterface>(simpletStore.items[0] || simpletStore.archive.items[0]);

const columns = computed<NDataTableColumns<SimpletInterface>>(() => {
  return [
    {
      key: 'name',
      title: t('simplet.name'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('name') },
      ],
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'simpletDeploy_uuid',
      title: t('simplet.uuid'),
      className: { hidden: !selectedColumns.value.includes('simpletDeploy_uuid') },
      render(row: SimpletInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.simpletDeploy_uuid }, '');
      },
    },
    {
      key: 'backendStatus',
      title: t('simplet.backendStatus'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('backendStatus') },
      ],
      render(row: SimpletInterface) {
        return h(resolveComponent('SimpletStatus'), { status: row.backendStatus });
      },
    },
    {
      key: 'frontendStatus',
      title: t('simplet.frontendStatus'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('frontendStatus') },
      ],
      render(row: SimpletInterface) {
        return h(resolveComponent('SimpletStatus'), { status: row.frontendStatus });
      },
    },
    tableRowCreateTime,
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

/** On row click */
const rowProps = (row: SimpletInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push(`/dashboard/simplet/${row.simpletDeploy_uuid}`);
      }
    },
  };
};

const dropdownOptions = [
  {
    key: 'view',
    label: t('general.view'),
    props: {
      onClick: () => {
        if (currentRow.value?.simpletDeploy_uuid) {
          router.push(`/dashboard/simplet/${currentRow.value.simpletDeploy_uuid}`);
        }
      },
    },
  },
  {
    key: 'delete',
    label: t('general.archive'),

    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        modalDeleteVisible.value = true;
      },
    },
  },
];

const dropdownOptionsArchive = [
  {
    key: 'restore',
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        restoreSimplet();
      },
    },
  },
];

onMounted(() => {
  initTableColumns(columns.value);
  simpletStore.getSimpletTemplates();
});

/** Search posts */
watch(
  () => props.search,
  _ => {
    simpletStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(handlePageChange, 500);

async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  await simpletStore.fetchSimplets(page, limit, props.archive);

  const p = props.archive ? simpletStore.archive.pagination : simpletStore.pagination;
  p.page = page;
  p.pageSize = limit;
}

async function onDeleted() {
  modalDeleteVisible.value = false;
  simpletStore.items = simpletStore.items.filter(
    item => item.simpletDeploy_uuid !== currentRow.value.simpletDeploy_uuid
  );

  sessionStorage.removeItem(LsCacheKeys.SIMPLETS);
  sessionStorage.removeItem(LsCacheKeys.SIMPLETS_ARCHIVED);
}

/**
 * Restore simplet
 * */
async function restoreSimplet() {
  simpletStore.loading = true;
  try {
    await $api.post<SimpletResponse>(endpoints.simpletActivate(currentRow.value.simpletDeploy_uuid));

    simpletStore.archive.items = simpletStore.archive.items.filter(
      item => item.simpletDeploy_uuid !== currentRow.value?.simpletDeploy_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.SIMPLETS);
    sessionStorage.removeItem(LsCacheKeys.SIMPLETS_ARCHIVED);

    message.success(t('form.success.restored.simplet'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  simpletStore.loading = false;
}
</script>
