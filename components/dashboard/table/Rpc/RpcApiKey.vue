<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="tableData"
    :loading="rpcApiKeyStore.loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
  />

  <modal v-model:show="modalEditRpcKeyVisible" :title="$t('service.edit')">
    <FormRpcApiKey :id="currentRow?.id" @submit-success="onRpcApiKeyUpdated" />
  </modal>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="modalDeleteRpcKey" :title="$t('service.delete')">
    <FormDelete :id="currentRow?.id" type="rpcApiKey" @submit-success="onRpcApiKeyDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NDropdown, NEllipsis, type DropdownOption } from 'naive-ui';

const props = defineProps({
  isOwner: { type: Boolean, default: false },
});

const { t } = useI18n();
const rpcApiKeyStore = useRpcApiKeyStore();

const pagination = reactive(createPagination(false));

const tableData = computed(() => {
  return rpcApiKeyStore.items.filter(item => item.name.toLowerCase().includes(rpcApiKeyStore.search.toLowerCase()));
});

const createColumns = (): NDataTableColumns<RpcApiKeyInterface> => {
  const columns: NDataTableColumns<RpcApiKeyInterface> = [
    {
      key: 'name',
      title: t('general.name'),
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'description',
      title: t('general.description'),
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'uuid',
      title: t('rpc.apiKey.uuid'),
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.uuid });
      },
    },
    {
      key: 'createTime',
      title: t('dashboard.created'),
      minWidth: 120,
      render(row) {
        return dateTimeToDateAndTime(row?.createTime || '');
      },
    },
  ];

  if (props.isOwner) {
    columns.push({
      key: 'actions',
      title: '',
      className: '!py-0 !sticky right-0',
      render() {
        return h(
          NDropdown,
          {
            options: dropdownOptions.value,
            trigger: 'click',
          },
          {
            default: () => h(resolveComponent('BtnActions')),
          }
        );
      },
    });
  }

  return columns;
};

const columns = createColumns();
const rowKey = (row: RpcApiKeyInterface) => row.id;
const currentRow = ref<RpcApiKeyInterface>();
const modalEditRpcKeyVisible = ref<boolean>(false);
const modalDeleteRpcKey = ref<boolean>(false);

function rowProps(row: RpcApiKeyInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

const dropdownOptions = computed(() => {
  const options = [
    {
      key: 'edit',
      label: t('general.edit'),
      props: {
        onClick: () => {
          rpcApiKeyStore.form.name = currentRow.value?.name || '';
          rpcApiKeyStore.form.description = currentRow.value?.description || '';
          modalEditRpcKeyVisible.value = true;
        },
      },
    },
  ] as DropdownOption[];

  if (tableData.value.length > 1) {
    options.push({
      key: 'delete',
      label: t('general.delete'),
      props: {
        class: '!text-pink',
        onClick: () => {
          modalDeleteRpcKey.value = true;
        },
      },
    });
  }

  return options;
});

function onRpcApiKeyDeleted() {
  modalDeleteRpcKey.value = false;
  if (currentRow.value) {
    rpcApiKeyStore.deleteItem(currentRow.value.id);
  }
}

watch(modalEditRpcKeyVisible, newValue => {
  if (!newValue) {
    rpcApiKeyStore.form.name = '';
    rpcApiKeyStore.form.description = '';
  }
});

function onRpcApiKeyUpdated() {
  modalEditRpcKeyVisible.value = false;
}
</script>
