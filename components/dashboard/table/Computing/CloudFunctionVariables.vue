<template>
  <div class="flex justify-end">
    <Btn
      type="primary"
      :loading="envLoading"
      :disabled="!cloudFunctionStore.variables.length"
      @click="createVariables"
    >
      {{ $t('computing.cloudFunctions.variable.btnCreate') }}
    </Btn>
  </div>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="cloudFunctionStore.variables"
    :loading="cloudFunctionStore.loading"
    :pagination="{
      pageSize: PAGINATION_LIMIT,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="p => (page = p)"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NInput } from 'naive-ui';

const { t } = useI18n();
const message = useMessage();
const warningStore = useWarningStore();
const cloudFunctionStore = useCloudFunctionStore();
const { envLoading, createEnvVariables } = useCloudFunctions();

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
const page = ref(1);
const editingRow = ref(-1);
const columns = createColumns();
const currentRow = ref<EnvVariable>();
const rowKey = (row: EnvVariable) =>
  cloudFunctionStore.variables.findIndex(item => item.key === row?.key);

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
          editingRow.value = cloudFunctionStore.variables.findIndex(
            item => item.key === currentRow.value?.key
          );
        },
      },
    },
    {
      label: t('general.delete'),
      key: 'delete',
      props: {
        class: '!text-pink',
        onClick: () => {
          cloudFunctionStore.variables = cloudFunctionStore.variables.filter(
            item => item.key !== currentRow.value?.key
          );
        },
      },
    },
  ];
});

/** On row click */
const rowProps = (row: EnvVariable) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
    },
  };
};

async function createVariables() {
  if (!cloudFunctionStore.variables.every(v => !!v.key && !!v.value)) {
    message.warning(t('validation.cloudFunctions.valuesRequired'));
  } else {
    warningStore.showSpendingWarning(PriceServiceName.COMPUTING_JOB_SET_ENVIRONMENT, () =>
      createEnvVariables(cloudFunctionStore.variables)
    );
  }
}
</script>
