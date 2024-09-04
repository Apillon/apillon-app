<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="cloudFunctionStore.jobs"
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

const createColumns = (): NDataTableColumns<JobInterface> => {
  return [
    {
      key: 'filename',
      title: t('computing.cloudFunctions.job.filename'),
    },
    {
      key: 'size',
      title: t('computing.cloudFunctions.job.size'),
    },
    {
      key: 'cid',
      title: t('computing.cloudFunctions.job.cid'),
      render(row: JobInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.cid }, '');
      },
    },
    {
      key: 'startTime',
      title: t('computing.cloudFunctions.job.dateStarted'),
      minWidth: 120,
      render(row) {
        return dateTimeToDateAndTime(row?.startTime || '');
      },
    },
    {
      key: 'jobStatus',
      title: t('general.status'),
      render(row: JobInterface) {
        return h(
          resolveComponent('Pill'),
          { type: jobStatusType(row.jobStatus) },
          AcurastJobStatus[row.jobStatus]
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
const rowKey = (row: JobInterface) => row.job_uuid;
const currentRow = ref<JobInterface>();

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
        onClick: () => {
          if (viewEnabled.value && currentRow.value) {
            router.push({
              path: `/dashboard/service/cloud-functions/${currentRow.value.job_uuid}`,
            });
          }
        },
      },
    },
  ];
});

/** On row click */
const rowProps = (row: JobInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath()) && viewEnabled.value) {
        router.push({ path: `/dashboard/service/cloud-functions/${row.job_uuid}` });
      }
    },
  };
};

const jobStatusType = (status: number) => {
  switch (status) {
    case AcurastJobStatus.DELETED:
      return 'error';
    case AcurastJobStatus.DEPLOYING:
      return 'info';
    default:
      return 'success';
  }
};
</script>
