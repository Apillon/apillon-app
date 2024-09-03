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
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const cloudFunctionStore = useCloudFunctionStore();

const createColumns = (): NDataTableColumns<CloudFunctionInterface> => {
  return [
    {
      key: 'key',
      title: t('form.label.cloudFunctions.varKey'),
    },
    {
      key: 'value',
      title: t('form.label.cloudFunctions.varValue'),
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
const rowKey = (row: CloudFunctionInterface) => row.job_uuid;
const currentRow = ref<CloudFunctionInterface>();

const viewEnabled = computed<boolean>(() => {
  return (currentRow.value?.status || 0) >= AcurastJobStatus.DEPLOYING;
});

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      label: t('general.view'),
      key: 'view',
      disabled: !viewEnabled.value,
      props: {
        onClick: () => {},
      },
    },
  ];
});

/** On row click */
const rowProps = (row: CloudFunctionInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
    },
  };
};
</script>
