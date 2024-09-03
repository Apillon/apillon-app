<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="contractStore.loading"
    :pagination="{
      pageSize: PAGINATION_LIMIT,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
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

  <!-- Modal - Archive contract -->
  <ModalDelete v-model:show="showModalArchiveContract" :title="$t('computing.contract.delete')">
    <template #content>
      <p>
        {{ $t('computing.contract.deleteConfirm') }}
      </p>
    </template>

    <slot>
      <FormDeleteItems :items="[currentRow]" @submit-success="onContractDeleted()" />
    </slot>
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  contracts: { type: Array<ContractInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const contractStore = useContractStore();
const { checkUnfinishedContracts } = useComputing();

const TableEllipsis = resolveComponent('TableEllipsis');
const ComputingContractStatus = resolveComponent('ComputingContractStatus');

const modalTransferOwnershipVisible = ref<boolean | null>(false);
const showModalArchiveContract = ref<boolean | null>(false);

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
      title: t('computing.contract.name'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'description',
      title: t('general.description'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'type',
      title: t('general.type'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      minWidth: 130,
      render(row) {
        return t(
          `computing.contract.type.${row.contractType || ComputingContractType.SCHRODINGER}`
        );
      },
    },
    {
      key: 'contract_uuid',
      title: t('computing.contract.uuid'),
      render(row: ContractInterface) {
        return h(TableEllipsis, { text: row.contract_uuid }, '');
      },
    },
    {
      key: 'contractAddress',
      title: t('computing.contract.address'),
      render(row: ContractInterface) {
        return h(TableEllipsis, { text: row.contractAddress }, '');
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
    {
      key: 'contractStatus',
      title: t('general.status'),
      render(row) {
        return h(ComputingContractStatus, { contractStatus: row.contractStatus }, '');
      },
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      className: '!py-0 !sticky right-0',
      render() {
        return h(
          NDropdown,
          {
            options: props.archive ? dropdownOptionsArchive : dropdownOptions.value,
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
  ];
};
const columns = createColumns();
const rowKey = (row: ContractInterface) => row.contract_uuid;
const currentRow = ref<ContractInterface>(props.contracts[0]);

const actionsDisabled = computed<boolean>(() => {
  return currentRow.value?.contractStatus !== ContractStatus.DEPLOYED || authStore.isAdmin();
});

const viewEnabled = computed<boolean>(() => {
  return currentRow.value?.contractStatus >= ContractStatus.DEPLOYING;
});

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      label: t('computing.contract.transfer'),
      key: 'transfer',
      disabled: dataStore.isProjectUser || actionsDisabled.value,
      props: {
        onClick: () => {
          if (!dataStore.isProjectUser && !actionsDisabled.value) {
            modalTransferOwnershipVisible.value = true;
          }
        },
      },
    },
    {
      label: t('general.view'),
      key: 'view',
      disabled: !viewEnabled.value,
      props: {
        onClick: () => {
          if (viewEnabled.value) {
            router.push({ path: `/dashboard/service/computing/${currentRow.value.contract_uuid}` });
          }
        },
      },
    },
    {
      key: 'computingDelete',
      label: t('general.delete'),
      disabled: authStore.isAdmin(),
      props: {
        class: '!text-pink',
        onClick: () => {
          showModalArchiveContract.value = true;
        },
      },
    },
  ];
});
const dropdownOptionsArchive = [
  {
    key: 'computingRestore',
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        restoreContract();
      },
    },
  },
];

/** On row click */
const rowProps = (row: ContractInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (!props.archive && canOpenColumnCell(e.composedPath()) && viewEnabled.value) {
        router.push({ path: `/dashboard/service/computing/${row.contract_uuid}` });
      }
    },
  };
};

function onContractTransferred() {
  modalTransferOwnershipVisible.value = false;
  setTimeout(async () => {
    await contractStore.fetchContracts();
    checkUnfinishedContracts();
  }, 3000);
}

/**
 * On contract deleted
 * Hide modal and refresh contract list
 * */
function onContractDeleted() {
  showModalArchiveContract.value = false;

  contractStore.items = contractStore.items.filter(
    item => item.contract_uuid !== currentRow.value.contract_uuid
  );

  sessionStorage.removeItem(LsCacheKeys.CONTRACTS);
  sessionStorage.removeItem(LsCacheKeys.CONTRACT_ARCHIVE);
}

/**
 * Restore contract
 * */
async function restoreContract() {
  contractStore.loading = true;

  try {
    await $api.patch<ContractResponse>(endpoints.contractActivate(currentRow.value.contract_uuid));
    contractStore.archive = contractStore.archive.filter(
      item => item.contract_uuid !== currentRow.value.contract_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.CONTRACTS);
    sessionStorage.removeItem(LsCacheKeys.CONTRACT_ARCHIVE);

    message.success(t('form.success.restored.contract'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  contractStore.loading = false;
}
</script>
