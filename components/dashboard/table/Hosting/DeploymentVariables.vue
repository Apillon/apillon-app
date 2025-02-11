<template>
  <n-space class="pb-8" :size="32" vertical>
    <div class="flex w-full flex-row-reverse justify-between gap-8">
      <n-space>
        <n-button size="small" @click="modalCreateVariableVisible = true">
          {{ $t('hosting.deploy.env-vars.add-new') }}
        </n-button>
        <n-button size="small" :loading="deploymentStore.loading" @click="refreshVariables">
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
    :pagination="{
      pageSize: PAGINATION_LIMIT,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
  />
  <modal v-model:show="modalCreateVariableVisible" :title="$t('hosting.deploy.env-vars.new-title')">
    <FormHostingDeploymentConfigVariable
      @submit-success="modalCreateVariableVisible = false"
      :config-id="websiteStore.active.deploymentConfig_id ?? 0"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NInput, NDataTable } from 'naive-ui';
import { h } from 'vue';

defineProps({
  variables: { type: Array<DeploymentConfigVariable>, default: [] },
});

const $i18n = useI18n();
const websiteStore = useWebsiteStore();
const rowInEdit = ref('');
const modalCreateVariableVisible = ref<boolean>(false);

const deploymentStore = useDeploymentStore();

const createColumns = (): NDataTableColumns<DeploymentConfigVariable> => {
  return [
    {
      title: $i18n.t('hosting.deploy.env-vars.key'),
      key: 'key',
      render(row: DeploymentConfigVariable) {
        return rowInEdit.value === row.key
          ? h(NInput, {
              value: row.key,
              onUpdateValue: (value: string) => updateVariable(row, 'key', value),
            })
          : row.key;
      },
    },
    {
      title: $i18n.t('hosting.deploy.env-vars.value'),
      key: 'value',
      render(row: DeploymentConfigVariable) {
        return rowInEdit.value === row.key
          ? h(NInput, {
              value: row.value,
              onUpdateValue: (value: string) => updateVariable(row, 'value', value),
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
            h('button', { class: 'icon-close text-2xl text-white', onClick: () => revertRow(row) }),
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

const updateVariable = (row: DeploymentConfigVariable, field: 'key' | 'value', value: string) => {
  const variable = deploymentStore.activeVariables.find(variable => variable.key === row.key);
  if (variable) {
    deploymentStore.activeVariables = deploymentStore.activeVariables.map(variable => {
      if (variable.key === row.key) {
        return {
          ...variable,
          [field]: value,
        };
      }
      return variable;
    });
  }
};

const editRow = (row: DeploymentConfigVariable) => {
  rowInEdit.value = row.key;
};

const saveRow = async (row: DeploymentConfigVariable) => {
  rowInEdit.value = '';
  if (row.key === '' || row.value === '') {
    window.$message.error($i18n.t('hosting.deploy.env-vars.error-empty'));
    deploymentStore.revertVariableChanges();
  } else {
    saveVariables();
  }
};

const deleteRow = (row: DeploymentConfigVariable) => {
  deploymentStore.activeVariables = deploymentStore.activeVariables.filter(variable => variable.key !== row.key);
  saveVariables();
};

const revertRow = (row: DeploymentConfigVariable) => {
  rowInEdit.value = '';
  deploymentStore.revertVariableChanges();
};

const refreshVariables = async () => {
  const deploymentConfigId = websiteStore.active.deploymentConfig_id;
  if (deploymentConfigId) {
    await deploymentStore.fetchVariables(deploymentConfigId);
  }
};

const saveVariables = () => {
  websiteStore.active.deploymentConfig_id && deploymentStore.saveVariables(websiteStore.active.deploymentConfig_id);
};
</script>
