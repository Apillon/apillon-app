<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="archive ? simpletsStore.archive.items : simpletsStore.items"
    :loading="archive ? simpletsStore.archive.loading : simpletsStore.loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    remote
    @update:page="(page: number) => handlePageChange(page, pagination.pageSize)"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />

  <!-- Modal - Edit simplet -->
  <modal v-model:show="showModalEditSimplet" :title="$t('dashboard.simplet.edit')">
    <FormHostingSimplet
      v-if="currentRow?.simplet_uuid"
      :simplet-uuid="currentRow.simplet_uuid"
      @submit-success="showModalEditSimplet = false"
    />
  </modal>

  <!-- Modal - Delete Simplet -->
  <ModalDelete v-model:show="showModalDeleteSimplet" :title="$t('dashboard.simplet.delete')">
    <FormDelete :id="currentRow?.simplet_uuid" :type="ItemDeleteKey.WEBSITE" @submit-success="() => {}" />
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
const simpletsStore = useSimpletsStore();

const { simplets } = useSolution();
const { availableColumns, selectedColumns, initTableColumns, handleColumnChange } = useTable(
  LsTableColumnsKeys.SIMPLETS
);
const pagination = reactive(props.archive ? simpletsStore.archive.pagination : simpletsStore.pagination);

const showModalEditSimplet = ref<boolean>(false);
const showModalDeleteSimplet = ref<boolean>(false);

const columns = computed<NDataTableColumns<SimpletInterface>>(() => {
  return [
    {
      key: 'name',
      title: t('dashboard.simplet.name'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('name') },
      ],
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'status',
      title: t('general.status'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('status') },
      ],
      render(row: SimpletInterface) {
        return h(resolveComponent('HostingDeploymentStatus'), { deploymentStatus: row.contractStatus });
      },
    },
    {
      key: 'simplet_uuid',
      title: t('dashboard.simplet.uuid'),
      className: { hidden: !selectedColumns.value.includes('simplet_uuid') },
      render(row: SimpletInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.simplet_uuid }, '');
      },
    },
    {
      title: t('dashboard.created'),
      key: 'created',
      render(row) {
        return h('span', {}, { default: () => dateTimeToMonthDay(row.createdTime) });
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
        return t(`dashboard.simplet.${simplets[row?.type || 1]}.name`);
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
const rowKey = (row: SimpletInterface) => row.simplet_uuid;
const currentRow = ref<SimpletInterface>();

/** On row click */
const rowProps = (row: SimpletInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push(`/dashboard/simplets/${row.simplet_uuid}`);
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
});

/** Search posts */
watch(
  () => props.search,
  _ => {
    simpletsStore.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(handlePageChange, 500);

async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  await simpletsStore.fetchSimplets(page, limit, props.archive);

  const p = props.archive ? simpletsStore.archive.pagination : simpletsStore.pagination;
  p.page = page;
  p.pageSize = limit;
}

/**
 * Restore simplet
 * */
async function restoreSimplet() {
  if (!currentRow.value?.simplet_uuid) return;
  simpletsStore.loading = true;

  try {
    await $api.patch<SimpletResponse>(endpoints.simpletActivate(currentRow.value.simplet_uuid));

    simpletsStore.archive.items = simpletsStore.archive.items.filter(
      item => item.simplet_uuid !== currentRow.value?.simplet_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.SIMPLETS);
    sessionStorage.removeItem(LsCacheKeys.SIMPLETS_ARCHIVED);

    message.success(t('form.success.restored.simplet'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  simpletsStore.loading = false;
}
</script>
