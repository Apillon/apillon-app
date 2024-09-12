<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="cloudFunctionStore.items"
    :loading="cloudFunctionStore.loading"
    :pagination="{
      ...cloudFunctionStore.pagination,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
  />

  <!-- Modal - Edit CloudFunction -->
  <modal
    v-if="currentRow?.function_uuid"
    v-model:show="modalEditCloudFunctionVisible"
    :title="$t('computing.cloudFunctions.new')"
  >
    <FormComputingCloudFunctions
      :function-uuid="currentRow?.function_uuid"
      @submit-success="modalEditCloudFunctionVisible = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const cloudFunctionStore = useCloudFunctionStore();

const modalEditCloudFunctionVisible = ref<boolean>(false);

const createColumns = (): NDataTableColumns<CloudFunctionInterface> => {
  return [
    {
      key: 'name',
      title: t('general.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'description',
      title: t('general.description'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'function_uuid',
      title: t('general.uuid'),
      render(row: CloudFunctionInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.function_uuid }, '');
      },
    },
    {
      key: 'createTime',
      title: t('dashboard.created'),
      minWidth: 120,
      render(row) {
        return dateTimeToDateAndTime(row?.createTime || '');
      },
    },
    {
      key: 'activeJob_id',
      title: t('general.status'),
      render(row) {
        return h(
          resolveComponent('Pill'),
          { type: !!row.activeJob_id ? 'success' : 'warning', class: 'min-w-16 justify-center' },
          { default: () => (!!row.activeJob_id ? t('general.active') : t('general.inactive')) }
        );
      },
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render() {
        return h(
          NDropdown,
          { options: dropdownOptions.value, trigger: 'click' },
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
  ];
};
const columns = createColumns();
const rowKey = (row: CloudFunctionInterface) => row.function_uuid;
const currentRow = ref<CloudFunctionInterface>();

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      key: 'view',
      label: t('general.view'),
      props: {
        onClick: () => {
          if (currentRow.value) {
            router.push({
              path: `/dashboard/service/cloud-functions/${currentRow.value.function_uuid}`,
            });
          }
        },
      },
    },
    {
      key: 'edit',
      label: t('general.edit'),
      props: {
        onClick: () => {
          if (currentRow.value) {
            modalEditCloudFunctionVisible.value = true;
          }
        },
      },
    },
  ];
});

/** On row click */
const rowProps = (row: CloudFunctionInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/cloud-functions/${row.function_uuid}` });
      }
    },
  };
};
</script>
