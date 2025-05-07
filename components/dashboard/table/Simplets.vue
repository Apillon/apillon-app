<template>
  <n-data-table
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
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />

  <!-- Modal - Edit simplet -->
  <modal v-model:show="showModalEditSimplet" :title="$t('simplet.edit')">
    <FormHostingSimplet
      v-if="currentRow?.simpletDeploy_uuid"
      :simplet-uuid="currentRow.simpletDeploy_uuid"
      @submit-success="showModalEditSimplet = false"
    />
  </modal>

  <!-- Modal - Delete Simplet -->
  <ModalDelete v-model:show="showModalDeleteSimplet" :title="$t('simplet.delete')">
    <FormDelete :id="currentRow?.simpletDeploy_uuid" :type="ItemDeleteKey.WEBSITE" @submit-success="() => {}" />
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
const dataStore = useDataStore();
const simpletStore = useSimpletStore();

const { getSimpletType } = useSimplet();
const { availableColumns, selectedColumns, initTableColumns, handleColumnChange } = useTable(
  LsTableColumnsKeys.SIMPLETS
);
const pagination = reactive(props.archive ? simpletStore.archive.pagination : simpletStore.pagination);

const showModalEditSimplet = ref<boolean>(false);
const showModalDeleteSimplet = ref<boolean>(false);

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
    {
      title: t('dashboard.created'),
      key: 'created',
      render(row: SimpletInterface) {
        return h('span', {}, { default: () => dateTimeToDate(row.createTime) });
      },
    },
    {
      key: 'type',
      title: t('general.type'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('type') },
      ],
      render(row: SimpletInterface) {
        return getSimpletType(row.simplet_uuid);
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
const rowKey = (row: SimpletInterface) => row.simpletDeploy_uuid;
const currentRow = ref<SimpletInterface>();

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
    key: 'simpletEdit',
    label: t('general.edit'),
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        showModalEditSimplet.value = true;
      },
    },
  },
  {
    key: 'simpletDelete',
    label: t('general.archive'),

    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        showModalDeleteSimplet.value = true;
      },
    },
  },
];

const dropdownOptionsArchive = [
  {
    key: 'hostingRestore',
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

/**
 * Restore simplet
 * */
async function restoreSimplet() {
  if (!currentRow.value?.simpletDeploy_uuid) return;
  simpletStore.loading = true;

  try {
    await $api.patch<SimpletResponse>(endpoints.simpletActivate(currentRow.value.simpletDeploy_uuid));

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
