<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsComputing @create-success="checkUnfinishedContract" />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="contractStore.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
    />

    <!-- Modal - Contract Transfer -->
    <modal v-model:show="modalTransferOwnershipVisible" :title="$t('computing.contract.transfer')">
      <FormComputingTransfer
        :contract-uuid="currentRow.contract_uuid"
        @submit-success="onContractTransferred"
      />
    </modal>
  </n-space>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  contracts: { type: Array<ContractInterface>, default: [] },
});

const { t } = useI18n();
const $i18n = useI18n();
const router = useRouter();
const contractStore = useContractStore();
const TableEllipsis = resolveComponent('TableEllipsis');
const ComputingContractStatus = resolveComponent('ComputingContractStatus');

let contractInterval: any = null as any;
const modalTransferOwnershipVisible = ref<boolean | null>(false);

/** Data: filtered contracts */
const data = computed<Array<ContractInterface>>(() => {
  return (
    props.contracts.filter(item =>
      item.name.toLocaleLowerCase().includes(contractStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<ContractInterface> => {
  return [
    {
      key: 'name',
      title: $i18n.t('computing.contract.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'description',
      title: $i18n.t('general.description'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'type',
      title: $i18n.t('general.type'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      minWidth: 130,
      render(row) {
        return $i18n.t(
          `computing.contract.type.${row.contractType || ComputingContractType.SCHRODINGER}`
        );
      },
    },
    {
      key: 'contract_uuid',
      title: $i18n.t('computing.contract.uuid'),
      render(row: ContractInterface) {
        return h(TableEllipsis, { text: row.contract_uuid }, '');
      },
    },
    {
      key: 'contractAddress',
      title: $i18n.t('computing.contract.address'),
      render(row: ContractInterface) {
        return h(TableEllipsis, { text: row.contractAddress }, '');
      },
    },
    {
      key: 'deployerAddress',
      title: $i18n.t('computing.contract.deployerAddress'),
      render(row: ContractInterface) {
        return h(TableEllipsis, { text: row.deployerAddress }, '');
      },
    },
    {
      key: 'createTime',
      title: $i18n.t('dashboard.created'),
      render(row) {
        return dateTimeToDateAndTime(row?.createTime || '');
      },
    },
    {
      key: 'contractStatus',
      title: $i18n.t('general.status'),
      render(row) {
        return h(ComputingContractStatus, { contractStatus: row.contractStatus }, '');
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
const rowKey = (row: ContractInterface) => row.contract_uuid;
const currentRow = ref<ContractInterface>(props.contracts[0]);

const actionsDisabled = computed<boolean>(() => {
  return currentRow.value?.contractStatus !== ContractStatus.DEPLOYED;
});

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      label: $i18n.t('computing.contract.transfer'),
      key: 'transfer',
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            modalTransferOwnershipVisible.value = true;
          }
        },
      },
    },
  ];
});

/** On row click */
const rowProps = (row: ContractInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/computing/${row.contract_uuid}` });
      }
    },
  };
};

function onContractTransferred() {
  modalTransferOwnershipVisible.value = false;
  setTimeout(async () => {
    await contractStore.fetchContracts();
    checkUnfinishedContract();
  }, 3000);
}

/** Contract polling */
function checkUnfinishedContract() {
  clearInterval(contractInterval);

  const unfinishedCollection = contractStore.items.find(
    contract =>
      contract.contractStatus === ContractStatus.DEPLOY_INITIATED ||
      contract.contractStatus === ContractStatus.DEPLOYING
  );
  if (unfinishedCollection === undefined) {
    return;
  }

  contractInterval = setInterval(async () => {
    const contracts = await contractStore.fetchContracts(false);
    const contract = contracts.find(
      contract => contract.contract_uuid === unfinishedCollection.contract_uuid
    );
    if (!contract || contract.contractStatus >= CollectionStatus.DEPLOYED) {
      clearInterval(contractInterval);
    }
  }, 30000);
}
</script>
