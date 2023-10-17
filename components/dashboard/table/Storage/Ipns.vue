<template>
  <n-data-table
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="ipnsStore.loading"
    :pagination="{ pageSize: PAGINATION_LIMIT }"
    :row-props="rowProps"
  />

  <!-- Modal - Edit IPNS -->
  <modal v-model:show="modalEditIpnsVisible" :title="$t('storage.ipns.edit')">
    <FormStorageIpns
      :ipns-id="currentRow?.id || 0"
      @submit-success="modalEditIpnsVisible = false"
    />
  </modal>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="modalDeleteIpnsVisible" :title="$t('storage.ipns.delete')">
    <FormDelete :id="currentRow?.id || 0" type="ipns" @submit-success="onIpnsDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const $i18n = useI18n();
const ipnsStore = useIpnsStore();

const currentRow = ref<IpnsInterface>({} as IpnsInterface);
const modalEditIpnsVisible = ref<boolean>(false);
const modalDeleteIpnsVisible = ref<boolean>(false);
const TableEllipsis = resolveComponent('TableEllipsis');
const TableLink = resolveComponent('TableLink');

/** Columns */
const createColumns = (): NDataTableColumns<IpnsInterface> => {
  return [
    {
      key: 'name',
      title: $i18n.t('storage.ipns.name'),
      minWidth: 100,
    },
    {
      key: 'description',
      title: $i18n.t('storage.ipns.description'),
    },
    {
      key: 'ipnsName',
      title: $i18n.t('storage.ipns.ipnsName'),
      render(row: IpnsInterface) {
        return h(TableEllipsis, { text: row.ipnsName }, '');
      },
    },
    {
      key: 'ipnsValue',
      title: $i18n.t('storage.ipns.link'),
      render(row: IpnsInterface) {
        return h(TableLink, { link: row.link }, '');
      },
    },
    {
      key: 'createTime',
      title: $i18n.t('general.updateTime'),
      render(row: IpnsInterface) {
        return h('span', {}, { default: () => datetimeToDateAndTime(row.updateTime || '') });
      },
    },
    {
      key: 'actions',
      title: '',
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
const columns = createColumns();

/** Dropdown options for files */
const dropdownOptions = [
  {
    key: 'edit',
    label: $i18n.t('general.edit'),
    props: {
      onClick: () => {
        modalEditIpnsVisible.value = true;
      },
    },
  },
  {
    key: 'delete',
    label: $i18n.t('general.delete'),
    props: {
      class: '!text-pink',
      onClick: () => {
        modalDeleteIpnsVisible.value = true;
      },
    },
  },
];

function rowProps(row: IpnsInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** Data: filtered files */
const data = computed<Array<IpnsInterface>>(() => {
  return (
    ipnsStore.items.filter(item =>
      item.name.toLocaleLowerCase().includes(ipnsStore.search.toLocaleLowerCase())
    ) || []
  );
});

/**
 * Delete Ipns
 */
async function onIpnsDeleted() {
  modalDeleteIpnsVisible.value = false;
  ipnsStore.items = ipnsStore.items.filter(item => item.id !== currentRow.value.id);
}
</script>
