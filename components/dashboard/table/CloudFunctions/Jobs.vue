<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
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
    <FormCloudFunctionsJob
      :function-uuid="cloudFunctionStore.functionUuid"
      :job-uuid="currentRow?.job_uuid"
      @submit-success="modalEditJobsVisible = false"
    />
  </modal>

  <!-- Modal - Delete Job -->
  <ModalDelete v-model:show="modalDeleteJobsVisible" :title="$t('computing.cloudFunctions.job.delete')">
    <template #content>
      <p>
        {{ $t(`storage.delete.deleteConfirm`, { num: 1 }) }}
      </p>
    </template>
    <FormDelete :id="currentRow?.job_uuid" type="job" @submit-success="onJobDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NDropdown } from 'naive-ui';

const message = useMessage();
const dataStore = useDataStore();
const warningStore = useWarningStore();
const cloudFunctionStore = useCloudFunctionStore();

const { t } = useI18n();
const { tableRowCreateTime, tableRowUpdateTime } = useTable();
const { checkUnfinishedJobs } = useCloudFunctions();

const loadingRedeploy = ref<boolean>(false);
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
        return h(
          'a',
          {
            href: `https://ipfs.io/ipfs/${row.scriptCid}`,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          row.scriptCid
        );
      },
    },
    tableRowCreateTime,
    tableRowUpdateTime,
    {
      key: 'jobStatus',
      title: t('general.status'),
      render(row: JobInterface) {
        return h(resolveComponent('ComputingCloudFunctionsJobStatus'), {
          jobStatus: row.jobStatus,
        });
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
            default: () => h(resolveComponent('BtnActions')),
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

const data = computed(
  () =>
    cloudFunctionStore.jobs
      .filter(item => item.name.toLowerCase().includes(cloudFunctionStore.searchJobs.toLowerCase()))
      .reverse() || []
);

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
      label: t('computing.cloudFunctions.job.redeploy'),
      key: 'redeploy',
      disabled: !actionsEnabled.value,
      props: {
        onClick: () => {
          if (actionsEnabled.value && currentRow.value) {
            warningStore.showSpendingWarning(PriceServiceName.COMPUTING_JOB_CREATE, () => redeploy(currentRow.value));
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
    onClick: (_: Event) => {
      currentRow.value = row;
    },
  };
};

async function redeploy(job?: JobInterface) {
  if (!dataStore.projectUuid || !job) return;

  loadingRedeploy.value = true;

  try {
    const bodyData = {
      project_uuid: dataStore.projectUuid,
      function_uuid: job.function_uuid,
      name: job.name,
      slots: job.slots,
      scriptCid: job.scriptCid,
    };
    const res = await $api.post<JobResponse>(endpoints.cloudFunctionJobs(job.function_uuid), bodyData);
    cloudFunctionStore.addJob(res.data);
    setTimeout(() => checkUnfinishedJobs(), 500);

    message.success(t('form.success.created.cloudFunctionJob'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loadingRedeploy.value = false;
}

/**
 * Delete Job
 */
function onJobDeleted(jobUuid: string) {
  modalDeleteJobsVisible.value = false;
  cloudFunctionStore.removeJob(jobUuid);
}
</script>
