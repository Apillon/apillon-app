<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="embeddedWallets"
    :loading="embeddedWalletStore.loading"
    :pagination="embeddedWalletStore.pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page="(page: number) => handlePageChange(page, embeddedWalletStore.pagination.pageSize)"
    @update:page-size="
      (pageSize: number) => handlePageChange(embeddedWalletStore.pagination.page, pageSize)
    "
    remote
  />
  <!-- Modal - Create Service -->
  <modal v-model:show="modalEditEmbeddedWalletVisible" :title="$t('embeddedWallet.edit')">
    <FormEmbeddedWallet
      :integration-uuid="currentRow.integration_uuid"
      @submit-success="modalEditEmbeddedWalletVisible = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

defineProps({
  embeddedWallets: { type: Array<EmbeddedWalletInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();
const modalEditEmbeddedWalletVisible = ref<boolean>(false);

/**
 * Dropdown Actions
 */
const dropdownOptions = [
  {
    key: 'view',
    label: t('general.view'),
    props: {
      onClick: () => {
        router.push(`/dashboard/service/embedded-wallet/${currentRow.value.integration_uuid}`);
      },
    },
  },
  {
    key: 'edit',
    label: t('general.edit'),
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        modalEditEmbeddedWalletVisible.value = true;
      },
    },
  },
  // {
  //   label: t('general.delete'),
  //   key: 'delete',
  //   disabled: dataStore.isProjectUser,
  //   props: {
  //     class: '!text-pink',
  //     onClick: () => {
  //     },
  //   },
  // },
];

const createColumns = (): NDataTableColumns<EmbeddedWalletInterface> => {
  return [
    {
      key: 'title',
      title: t('embeddedWallet.table.title'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'description',
      title: t('general.description'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'integration_uuid',
      title: t('embeddedWallet.table.integration_uuid'),
      render(row: EmbeddedWalletInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.integration_uuid }, '');
      },
    },
    {
      key: 'numOfSignatures',
      title: t('embeddedWallet.table.numberOfSignatures'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      title: t('embeddedWallet.table.created'),
      key: 'created',
      render(row: EmbeddedWalletInterface) {
        return h('span', {}, { default: () => dateTimeToDate(row.createTime) });
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
          {
            options: dropdownOptions,
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

const rowKey = (row: EmbeddedWalletInterface) => row.integration_uuid;
const currentRow = ref<EmbeddedWalletInterface>({} as EmbeddedWalletInterface);
const columns = createColumns();

function rowProps(row: EmbeddedWalletInterface) {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/embedded-wallet/${row.integration_uuid}` });
      }
    },
  };
}

/** On page change, load data */
async function handlePageChange(page: number = 1, limit: number = PAGINATION_LIMIT) {
  if (!embeddedWalletStore.loading) {
    await embeddedWalletStore.fetchEmbeddedWallets(page, limit);

    embeddedWalletStore.pagination.page = page;
    embeddedWalletStore.pagination.pageSize = limit;
  }
}
</script>
