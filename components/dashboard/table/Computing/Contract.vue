<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsComputing />

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

    <!-- Modal - Deposit -->
    <modal v-model:show="modalDepositVisible" :title="$t('computing.contract.deposit')">
      <FormComputingDeposit
        :contract-uuid="contractStore.active.contract_uuid"
        @submit-success="onContractDeposit"
      />
    </modal>

    <!-- Modal - Contract Transfer -->
    <modal v-model:show="modalTransferOwnershipVisible" :title="$t('computing.contract.transfer')">
      <FormComputingTransfer
        :contract-uuid="contractStore.active.contract_uuid"
        @submit-success="onContractTransferred"
      />
    </modal>
  </n-space>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  contracts: { type: Array<ContractInterface>, default: [] },
});

const { t } = useI18n();
const $i18n = useI18n();
const router = useRouter();
const contractStore = useContractStore();
const TableEllipsis = resolveComponent('TableEllipsis');
const ComputingContractStatus = resolveComponent('ComputingContractStatus');

const modalDepositVisible = ref<boolean | null>(false);
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
      key: 'type',
      title: $i18n.t('general.type'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      minWidth: 100,
      render(row) {
        if (row.contractType) {
          return $i18n.t(`computing.contract.type.${row.contractType}`);
        } else {
          return $i18n.t(`computing.contract.type.${ComputingContractType.SCHRODINGER}`);
        }
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
          { options: dropdownOptions, trigger: 'click' },
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
  return contractStore.active?.contractStatus < 0;
});

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    label: t('computing.contract.deposit'),
    key: 'deposit',
    disabled: actionsDisabled.value,
    props: {
      onClick: () => {
        if (!actionsDisabled.value) {
          modalDepositVisible.value = true;
        }
      },
    },
  },
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

function onContractDeposit() {
  modalDepositVisible.value = false;
  setTimeout(() => {
    contractStore.fetchContracts();

    setTimeout(() => {
      // checkUnfinishedTransactions();
    }, 10000);
  }, 3000);
}
function onContractTransferred() {
  modalTransferOwnershipVisible.value = false;
  setTimeout(() => {
    contractStore.fetchContracts();

    setTimeout(() => {
      // checkUnfinishedTransactions();
    }, 10000);
  }, 3000);
}
</script>
