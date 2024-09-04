<template>
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
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NInput } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();
const cloudFunctionStore = useCloudFunctionStore();

const createColumns = (): NDataTableColumns<EnvVariable> => {
  return [
    {
      key: 'key',
      title: t('form.label.cloudFunctions.varKey'),
    },
    {
      key: 'value',
      title: t('form.label.cloudFunctions.varValue'),
      render(row: EnvVariable) {
        return h(NInput, {
          value: row.value,
          showPasswordOn: 'click',
          size: 'small',
          type: 'password',
          readonly: true,
          onUpdateValue(v) {
            // row.value = v;
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
const columns = createColumns();
const currentRow = ref<EnvVariable>();
const rowKey = (row: EnvVariable) => row.key;

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      label: t('general.delete'),
      key: 'delete',
      props: {
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
</script>
