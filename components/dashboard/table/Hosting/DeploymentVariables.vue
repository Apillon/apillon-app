<template>
  <div class="">
    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="deploymentStore.variables"
      :loading="deploymentStore.loading"
      :pagination="pagination"
      :row-key="rowKey"
      @update:page="p => (page = p)"
      @update:page-size="(pz: number) => (pagination.pageSize = pz)"
    />
    <div class="mt-1 inline-flex -translate-y-full items-center gap-2">
      <n-button @click="addEmptyVariable">
        {{ $t('hosting.deploy.env-vars.add-new') }}
      </n-button>
      <n-button :loading="deploymentStore.loading" @click="refreshVariables">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NInput, NDataTable } from 'naive-ui';

const props = defineProps({
  configId: { type: Number, required: true },
});

const { t } = useI18n();
const message = useMessage();
const deploymentStore = useDeploymentStore();

const page = ref(1);
const editingRow = ref(-1);
const pagination = reactive(createPagination(false));
const rowKey = (row: EnvVariable) =>
  deploymentStore.variables.findIndex(item => item.key === row?.key && item.value === row?.value);

const isEditingRow = (i: number) => editingRow.value === (page.value - 1) * PAGINATION_LIMIT + i;
const hasEmptyKey = () => deploymentStore.variables.some(variable => variable.key === '');
const hasEmptyValue = () => deploymentStore.variables.some(variable => variable.value === '');
const addEmptyVariable = () => {
  deploymentStore.variables.push({ key: '', value: '' });
  editingRow.value = deploymentStore.variables.length - 1;
};
const keys = () => deploymentStore.variables.map(item => item.key);
const areKeysUnique = () => new Set(keys()).size === keys.length;

const columns = computed<NDataTableColumns<DeploymentConfigVariable>>(() => {
  return [
    {
      key: 'key',
      title: t('hosting.deploy.env-vars.key'),
      render(row: DeploymentConfigVariable, index: number) {
        return isEditingRow(index)
          ? h(NInput, {
              value: row.key,
              size: 'small',
              onUpdateValue(k: string) {
                if (isEditingRow(index)) {
                  row.key = k;
                }
              },
              onKeyup(e) {
                if (e.key === 'Enter') {
                  editingRow.value = -1;
                }
              },
            })
          : row.key;
      },
    },
    {
      key: 'value',
      title: t('hosting.deploy.env-vars.value'),
      render(row: DeploymentConfigVariable, index: number) {
        return isEditingRow(index)
          ? h(NInput, {
              value: row.value,
              size: 'small',
              onUpdateValue(v: string) {
                if (isEditingRow(index)) {
                  row.value = v;
                }
              },
              onKeyup(e) {
                if (e.key === 'Enter') {
                  editingRow.value = -1;
                }
              },
            })
          : row.value;
      },
    },
    {
      key: 'actions',
      title: '',
      render(row: DeploymentConfigVariable, index: number) {
        if (isEditingRow(index)) {
          return h('div', { class: 'flex justify-end gap-2' }, [
            h('button', { class: 'icon-check text-2xl text-white', onClick: () => saveRow(row) }),
            h('button', { class: 'icon-close text-2xl text-white', onClick: () => revertRow() }),
          ]);
        } else {
          return h('div', { class: 'flex justify-end gap-2' }, [
            h('button', { class: 'icon-edit text-2xl text-white', onClick: () => (editingRow.value = index) }),
            h('button', { class: 'icon-delete text-2xl text-white', onClick: () => deleteRow(row) }),
          ]);
        }
      },
    },
  ];
});

const saveRow = async (row: DeploymentConfigVariable) => {
  editingRow.value = -1;
  if (row.key === '' || row.value === '') {
    message.error(t('hosting.deploy.env-vars.error-empty'));
  } else if (hasEmptyKey() || hasEmptyValue()) {
    message.error(t('hosting.deploy.env-vars.error-empty'));
  } else if (areKeysUnique()) {
    message.error(t('validation.cloudFunctions.keyNotUnique'));
  } else {
    saveVariables();
  }
};

const deleteRow = (row: DeploymentConfigVariable) => {
  deploymentStore.variables = deploymentStore.variables.filter(variable => variable.key !== row.key);
  saveVariables();
};

const revertRow = () => {
  editingRow.value = -1;
  refreshVariables();
};

const refreshVariables = async () => deploymentStore.fetchVariables(props.configId);
const saveVariables = () => deploymentStore.saveVariables(props.configId);
</script>
