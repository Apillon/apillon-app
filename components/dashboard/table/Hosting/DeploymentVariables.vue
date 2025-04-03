<template>
  <n-space class="pb-8" :size="32" vertical>
    <div class="flex w-full flex-row-reverse justify-between gap-8">
      <n-space>
        <n-button @click="modalCreateVariableVisible = true">
          {{ $t('hosting.deploy.env-vars.add-new') }}
        </n-button>
        <n-button :loading="deploymentStore.loading" @click="refreshVariables">
          <span class="icon-refresh mr-2 text-xl"></span>
          {{ $t('general.refresh') }}
        </n-button>
      </n-space>
    </div>
  </n-space>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="variables"
    :loading="deploymentStore.loading"
    :pagination="pagination"
    :row-key="rowKey"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />
  <modal v-model:show="modalCreateVariableVisible" :title="$t('hosting.deploy.env-vars.new-title')">
    <FormHostingDeploymentConfigVariable
      :config-id="deploymentStore.deploymentConfig?.id ?? 0"
      @submit-success="modalCreateVariableVisible = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { NInput, NDataTable } from 'naive-ui';

defineProps({
  variables: { type: Array<DeploymentConfigVariable>, default: [] },
});

const { t } = useI18n();
const deploymentStore = useDeploymentStore();

const rowInEdit = ref('');
const modalCreateVariableVisible = ref<boolean>(false);
const pagination = reactive(createPagination(false));

const createColumns = (): NDataTableColumns<DeploymentConfigVariable> => {
  return [
    {
      title: t('hosting.deploy.env-vars.key'),
      key: 'key',
      render(row: DeploymentConfigVariable) {
        return rowInEdit.value === row.key
          ? h(NInput, {
              value: deploymentStore.variableForm.key,
              onUpdateValue: (value: string) => (deploymentStore.variableForm.key = value),
            })
          : row.key;
      },
    },
    {
      title: t('hosting.deploy.env-vars.value'),
      key: 'value',
      render(row: DeploymentConfigVariable) {
        return rowInEdit.value === row.key
          ? h(NInput, {
              value: deploymentStore.variableForm.value,
              onUpdateValue: (value: string) => (deploymentStore.variableForm.value = value),
            })
          : row.value;
      },
    },
    {
      key: 'actions',
      title: '',
      render(row: DeploymentConfigVariable) {
        if (rowInEdit.value === row.key) {
          return h('div', { style: { display: 'flex', gap: '8px' } }, [
            h('button', { class: 'icon-check text-2xl text-white', onClick: () => saveRow(row) }),
            h('button', { class: 'icon-close text-2xl text-white', onClick: () => revertRow() }),
          ]);
        } else {
          return h('div', { style: { display: 'flex', gap: '8px' } }, [
            h('button', { class: 'icon-edit text-2xl text-white', onClick: () => editRow(row) }),
            h('button', { class: 'icon-delete text-2xl text-white', onClick: () => deleteRow(row) }),
          ]);
        }
      },
    },
  ];
};

const columns = createColumns();

const rowKey = (row: DeploymentConfigVariable) => row.key;

const editRow = (row: DeploymentConfigVariable) => {
  rowInEdit.value = row.key;
  deploymentStore.variableForm = { key: row.key, value: row.value, prevKey: row.key };
};

const saveRow = async (row: DeploymentConfigVariable) => {
  rowInEdit.value = '';
  if (row.key === '' || row.value === '') {
    window.$message.error(t('hosting.deploy.env-vars.error-empty'));
    deploymentStore.revertVariableChanges();
  } else {
    saveVariables();
  }
};

const deleteRow = (row: DeploymentConfigVariable) => {
  deploymentStore.variables = deploymentStore.variables.filter(variable => variable.key !== row.key);
  saveVariables();
};

const revertRow = () => {
  rowInEdit.value = '';
  deploymentStore.variableForm = { key: '', value: '' };
};

const refreshVariables = async () => {
  const deploymentConfigId = deploymentStore.deploymentConfig?.id;
  if (deploymentConfigId) {
    await deploymentStore.fetchVariables(deploymentConfigId);
  }
};

const saveVariables = () => {
  if (deploymentStore.deploymentConfig) {
    deploymentStore.saveVariables(deploymentStore.deploymentConfig.id);
  }
};
</script>
