<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="contracts"
    :loading="archive ? deployedContractStore.archive.loading : deployedContractStore.loading"
    :pagination="archive ? deployedContractStore.archive.pagination : deployedContractStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="(page: number) => handlePageChange(page, deployedContractStore.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(1, pageSize)"
    remote
  />
</template>

<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core';
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  contracts: { type: Array<DeployedContractInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t, te } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const deployedContractStore = useDeployedContractStore();
const { deleteItem } = useDelete();

const rowKey = (row: DeployedContractInterface) => row.contract_uuid;
const currentRow = ref<DeployedContractInterface>(props.contracts[0]);

const availableColumns = ref([
  { value: 'name', label: t('dashboard.service.smartContracts.table.name') },
  { value: 'chain', label: t('dashboard.service.smartContracts.table.chain') },
  { value: 'contractAddress', label: t('dashboard.service.smartContracts.table.contractAddress') },
  { value: 'version', label: t('dashboard.service.smartContracts.table.version') },
  { value: 'description', label: t('general.description') },
  { value: 'contractStatus', label: t('dashboard.service.smartContracts.table.contractStatus') },
  { value: 'contractType', label: t('dashboard.service.smartContracts.table.contractType') },
]);
const selectedColumns = ref([
  'name',
  'chain',
  'contractAddress',
  'version',
  'description',
  'contractStatus',
  'contractType',
]);

const columns = computed(() => [
  {
    key: 'name',
    title: t('dashboard.service.smartContracts.table.name'),
    className: [{ [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive }, { hidden: !selectedColumns.value.includes('name') }],
    render(row: DeployedContractInterface) {
      return h('strong', {}, { default: () => row.name });
    },
  },
  {
    key: 'chain',
    title: t('dashboard.service.smartContracts.table.chain'),
    className: [{ [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive }, { hidden: !selectedColumns.value.includes('chain') }],
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
    title: t('dashboard.service.smartContracts.table.contractAddress'),
    minWidth: 100,
    className: { hidden: !selectedColumns.value.includes('contractAddress') },
    render(row: DeployedContractInterface) {
      return h(
        resolveComponent('TableLink'),
        { link: contractLink(row.contractAddress, row.chain), text: row.contractAddress },
        ''
      );
    },
  },
  {
    key: 'contractType',
    title: t('dashboard.service.smartContracts.table.contractType'),
    className: [
      { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
      { hidden: !selectedColumns.value.includes('contractType') },
    ],
    render(row: DeployedContractInterface) {
      return !!row?.contractType && te(`dashboard.service.smartContracts.type.${row.contractType}`)
        ? t(`dashboard.service.smartContracts.type.${row.contractType}`)
        : '';
    },
  },
  {
    key: 'contractVersion',
    title: t('dashboard.service.smartContracts.table.version'),
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
    title: t('dashboard.service.smartContracts.table.contractStatus'),
    className: { hidden: !selectedColumns.value.includes('contractStatus') },
    render(row: DeployedContractInterface) {
      return h(resolveComponent('SmartContractsStatusLabel'), { contractStatus: row.contractStatus }, '');
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
]);

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
    key: 'socialDelete',
    label: t('general.archive'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        deleteSmartContract();
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
  /** Check if selected columns are stored in LS */
  if (localStorage.getItem(LsTableColumnsKeys.SMART_CONTRACTS)) {
    selectedColumns.value = JSON.parse(localStorage.getItem(LsTableColumnsKeys.SMART_CONTRACTS) || '');
  }
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

function handleColumnChange(selectedValues: Array<string>) {
  selectedColumns.value = selectedValues;
  localStorage.setItem(LsTableColumnsKeys.SMART_CONTRACTS, JSON.stringify(selectedColumns.value));
}

async function deleteSmartContract() {
  if (currentRow.value && (await deleteItem(ItemDeleteKey.SMART_CONTRACT, currentRow.value.contract_uuid))) {
    deployedContractStore.items = deployedContractStore.items.filter(
      item => item.contract_uuid !== currentRow.value?.contract_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.SMART_CONTRACTS_DEPLOYED_ARCHIVED);
  }
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
