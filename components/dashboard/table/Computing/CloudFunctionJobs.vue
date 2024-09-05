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

  <!-- Modal - Edit Job -->
  <modal v-model:show="modalEditJobsVisible" :title="$t('computing.cloudFunctions.job.edit')">
    <FormComputingCloudFunctionsJob
      :function-uuid="cloudFunctionStore.functionUuid"
      :job-uuid="currentRow?.job_uuid"
      @submit-success="modalEditJobsVisible = false"
    />
  </modal>

  <!-- Modal - Delete Job -->
  <ModalDelete
    v-model:show="modalDeleteJobsVisible"
    :title="$t('computing.cloudFunctions.job.delete')"
  >
    <template #content>
      <p>
        {{ $t(`storage.delete.deleteConfirm`, { num: 1 }) }}
      </p>
    </template>
    <FormDelete :id="currentRow?.job_uuid" type="job" @submit-success="onJobDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const cloudFunctionStore = useCloudFunctionStore();

const modalEditJobsVisible = ref<boolean>(false);
const modalDeleteJobsVisible = ref<boolean>(false);

const createColumns = (): NDataTableColumns<JobInterface> => {
  return [
    {
      key: 'name',
      title: t('computing.cloudFunctions.job.name'),
    },
    {
      key: 'job_uuid',
      title: t('general.uuid'),
      render(row: JobInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.job_uuid }, '');
      },
    },
    {
      key: 'cid',
      title: t('computing.cloudFunctions.job.cid'),
      render(row: JobInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.scriptCid }, '');
      },
    },
    {
      key: 'startTime',
      title: t('form.label.cloudFunctions.startTime'),
      minWidth: 120,
      render(row) {
        return dateTimeToDateAndTime(row?.startTime || '');
      },
    },
    {
      key: 'endTime',
      title: t('form.label.cloudFunctions.endTime'),
      minWidth: 120,
      render(row) {
        return dateTimeToDateAndTime(row?.endTime || '');
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

const actionsEnabled = computed<boolean>(() => {
  return (currentRow.value?.jobStatus || 0) >= AcurastJobStatus.DEPLOYED;
});

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      label: t('general.edit'),
      key: 'edit',
      disabled: !actionsEnabled.value,
      props: {
        onClick: () => {
          if (actionsEnabled.value && currentRow.value) {
            modalEditJobsVisible.value = true;
          }
        },
      },
    },
    {
      label: t('general.delete'),
      key: 'delete',
      disabled: !actionsEnabled.value,
      props: {
        class: actionsEnabled.value ? '!text-pink' : '',
        onClick: () => {
          if (actionsEnabled.value && currentRow.value) {
            modalDeleteJobsVisible.value = true;
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

      if (canOpenColumnCell(e.composedPath()) && actionsEnabled.value) {
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

/**
 * Delete Job
 */
function onJobDeleted(jobUuid: string) {
  modalDeleteJobsVisible.value = false;
  cloudFunctionStore.removeJob(jobUuid);
}
</script>
