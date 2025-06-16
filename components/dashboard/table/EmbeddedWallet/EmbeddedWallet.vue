<template>
  <DataTable
    :bordered="false"
    :columns="columns"
    :data="items"
    :loading="embeddedWalletStore.loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />
  <!-- Modal - Edit embedded wallet -->
  <modal v-model:show="modalEditEmbeddedWalletVisible" :title="$t('embeddedWallet.edit')">
    <FormEmbeddedWallet
      :integration-uuid="currentRow.integration_uuid"
      @submit-success="modalEditEmbeddedWalletVisible = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NDropdown } from 'naive-ui';

defineProps({
  archive: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const embeddedWalletStore = useEmbeddedWalletStore();
const modalEditEmbeddedWalletVisible = ref<boolean>(false);

const pagination = reactive(createPagination(false));
const items = computed(() => {
  return embeddedWalletStore.items.filter(item =>
    item.title.toLowerCase().includes(embeddedWalletStore.search.toLowerCase())
  );
});
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
            default: () => h(resolveComponent('BtnActions')),
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
</script>
