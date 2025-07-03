<template>
  <DataTable
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="contracts"
    :loading="archive ? deployedContractStore.archive.loading : deployedContractStore.loading"
    :pagination="archive ? deployedContractStore.archive.pagination : deployedContractStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    remote
    @update:page="(page: number) => handlePageChange(page, deployedContractStore.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
  />
  <!-- Modal - Delete -->
  <ModalDelete v-model:show="modalDeleteVisible" :title="$t('smartContracts.delete')">
    <FormDelete :id="currentRow.contract_uuid" :type="ItemDeleteKey.SMART_CONTRACT" @submit-success="onDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { NDropdown } from 'naive-ui';

const props = defineProps({
  contracts: { type: Array<DeployedContractInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t, te } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const deployedContractStore = useDeployedContractStore();
const { availableColumns, selectedColumns, initTableColumns, handleColumnChange } = useTable(
  LsTableColumnsKeys.SMART_CONTRACTS
);

const modalDeleteVisible = ref<boolean>(false);
const rowKey = (row: DeployedContractInterface) => row.contract_uuid;
const currentRow = ref<DeployedContractInterface>(props.contracts[0]);

const columns = computed<NDataTableColumns<DeployedContractInterface>>(() => {
  return [
    {
      key: 'name',
      title: t('smartContracts.table.name'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('name') },
      ],
      render(row: DeployedContractInterface) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'chain',
      title: t('smartContracts.table.chain'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('chain') },
      ],
      minWidth: 120,
      render(row: DeployedContractInterface) {
        return h(
          'span',
          {},
          {
            default: () =>
              te(`nft.chain.${EvmChain[row.chain]}`) ? t(`nft.chain.${EvmChain[row.chain]}`) : EvmChain[row.chain],
          }
        );
      },
    },
    {
      key: 'contractAddress',
      title: t('smartContracts.table.contractAddress'),
      minWidth: 100,
      className: { hidden: !selectedColumns.value.includes('contractAddress') },
      render(row: DeployedContractInterface) {
        return h(
          resolveComponent('TableLink'),
          { link: contractLink(row.contractAddress, row.chain), text: truncateWallet(row.contractAddress) },
          ''
        );
      },
    },
    {
      key: 'contractType',
      title: t('smartContracts.table.contractType'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('contractType') },
      ],
      render(row: DeployedContractInterface) {
        return !!row?.contractType && te(`service.smartContracts.type.${row.contractType}`)
          ? t(`service.smartContracts.type.${row.contractType}`)
          : '';
      },
    },
    {
      key: 'contractVersion',
      title: t('smartContracts.table.version'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('version') },
      ],
    },
    {
      key: 'description',
      title: t('general.description'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('description') },
      ],
    },
    {
      key: 'contractStatus',
      title: t('smartContracts.table.contractStatus'),
      className: { hidden: !selectedColumns.value.includes('contractStatus') },
      render(row: DeployedContractInterface) {
        return h(resolveComponent('SmartContractsStatus'), { status: row.contractStatus }, '');
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
      filter: 'default',
      filterOptionValue: null,
      renderFilterIcon: () => {
        return h('span', { class: 'icon-more' }, '');
      },
      renderFilterMenu: () => {
        return h(
          resolveComponent('TableColumns'),
          {
            model: selectedColumns.value,
            columns: availableColumns.value,
            onColumnChange: handleColumnChange,
          },
          ''
        );
      },
      render() {
        return h(
          NDropdown,
          {
            options: props.archive ? dropdownOptionsArchive : dropdownOptions,
            trigger: 'click',
          },
          {
            default: () => h(resolveComponent('BtnActions')),
          }
        );
      },
    },
  ];
});

/** On row click */
const rowProps = (row: DeployedContractInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
      if (!props.archive && canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/smart-contracts/deployed/${row.contract_uuid}` });
      }
    },
  };
};

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    key: 'view',
    label: t('general.view'),
    props: {
      onClick: () => {
        router.push({
          path: `/dashboard/service/smart-contracts/deployed/${currentRow.value.contract_uuid}`,
        });
      },
    },
  },
  {
    key: 'delete',
    label: t('general.archive'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        modalDeleteVisible.value = true;
      },
    },
  },
];

const dropdownOptionsArchive = [
  {
    key: 'restore',
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        restoreSmartContract();
      },
    },
  },
];

onMounted(() => {
  initTableColumns(columns.value);
});

/** Search posts */
watch(
  () => deployedContractStore.search,
  _ => {
    deployedContractStore.loading = true;
    debouncedSearchFilter();
  }
);
watch(
  () => deployedContractStore.archive.search,
  _ => {
    deployedContractStore.archive.loading = true;
    debouncedSearchFilter();
  }
);
const debouncedSearchFilter = useDebounceFn(handlePageChange, 500);

async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  if (props.archive) {
    await deployedContractStore.fetchDeployedContractsArchive(page, limit);
    deployedContractStore.archive.pagination.page = page;
    deployedContractStore.archive.pagination.pageSize = limit;
  } else {
    await deployedContractStore.fetchDeployedContracts(page, limit);
    deployedContractStore.pagination.page = page;
    deployedContractStore.pagination.pageSize = limit;
  }
}

async function onDeleted() {
  modalDeleteVisible.value = false;
  deployedContractStore.items = deployedContractStore.items.filter(
    item => item.contract_uuid !== currentRow.value?.contract_uuid
  );
  sessionStorage.removeItem(LsCacheKeys.SMART_CONTRACTS_DEPLOYED_ARCHIVED);
}

async function restoreSmartContract() {
  if (!currentRow.value?.contract_uuid) return;

  deployedContractStore.loading = true;

  try {
    await $api.patch<DeployedContractResponse>(endpoints.smartContractsActivate(currentRow.value?.contract_uuid));

    deployedContractStore.archive.items = deployedContractStore.archive.items.filter(
      item => item.contract_uuid !== currentRow.value?.contract_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.SMART_CONTRACTS_DEPLOYED);

    message.success(t('form.success.restored.smartContract'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  deployedContractStore.loading = false;
}
</script>
