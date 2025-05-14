<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="cloudFunctionStore.loadingVariables"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="p => (page = p)"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />
</template>

<script lang="ts" setup>
import { NDropdown, NInput } from 'naive-ui';

const { t } = useI18n();
const cloudFunctionStore = useCloudFunctionStore();

const pagination = reactive(createPagination(false));

const data = computed(
  () =>
    [...cloudFunctionStore.variables, ...cloudFunctionStore.variablesNew].filter(item =>
      `${item.key} ${item.value}`.toLowerCase().includes(cloudFunctionStore.searchVariables.toLowerCase())
    ) || []
);

const createColumns = (): NDataTableColumns<EnvVariable> => {
  return [
    {
      key: 'key',
      title: t('form.label.cloudFunctions.varKey'),
      render(row: EnvVariable, index: number) {
        return isEditingRow(index)
          ? h(NInput, {
              value: row.key,
              size: 'small',
              type: 'text',
              readonly: !isEditingRow(index),
              onUpdateValue(v) {
                row.key = v;
                cloudFunctionStore.variablesUpdate = true;
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
      title: t('form.label.cloudFunctions.varValue'),
      render(row: EnvVariable, index: number) {
        return h(NInput, {
          value: row.value,
          showPasswordOn: 'click',
          size: 'small',
          type: 'password',
          readonly: !isEditingRow(index),
          onUpdateValue(v) {
            if (isEditingRow(index)) {
              row.value = v;
              cloudFunctionStore.variablesUpdate = true;
            }
          },
          onKeyup(e) {
            if (e.key === 'Enter') {
              editingRow.value = -1;
            }
          },
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
const page = ref(1);
const editingRow = ref(-1);
const columns = createColumns();
const currentRow = ref<EnvVariable>();
const rowKey = (row: EnvVariable) => data.value.findIndex(item => item.key === row?.key);

const isEditingRow = (i: number) => editingRow.value === (page.value - 1) * PAGINATION_LIMIT + i;

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      label: t('general.edit'),
      key: 'edit',
      props: {
        onClick: () => {
          editingRow.value = data.value.findIndex(item => item.key === currentRow.value?.key);
        },
      },
    },
    {
      label: t('general.delete'),
      key: 'delete',
      props: {
        class: '!text-pink',
        onClick: () => {
          if (cloudFunctionStore.variables.find(item => item.key === currentRow.value?.key)) {
            cloudFunctionStore.variables = cloudFunctionStore.variables.filter(
              item => item.key !== currentRow.value?.key
            );
          } else {
            cloudFunctionStore.variablesNew = cloudFunctionStore.variablesNew.filter(
              item => item.key !== currentRow.value?.key
            );
          }
          cloudFunctionStore.variablesUpdate = true;
        },
      },
    },
  ];
});

/** On row click */
const rowProps = (row: EnvVariable) => {
  return {
    onClick: (_: Event) => {
      currentRow.value = row;
    },
  };
};
</script>
