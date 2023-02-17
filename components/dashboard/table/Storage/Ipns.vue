<template>
  <n-data-table
    v-bind="$attrs"
    remote
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

  <!-- Modal - Publish File on IPNS -->
  <modal v-model:show="modalPublishIpnsVisible" :title="$t('storage.ipns.publish')">
    <FormStorageIpnsPublish
      :ipns-id="currentRow?.id || 0"
      @submit-success="modalPublishIpnsVisible = false"
    />
  </modal>

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="modalDeleteIpnsVisible" :title="$t('storage.ipns.delete')">
    <FormDelete :id="currentRow?.id || 0" type="ipns" @submit-success="onIpnsDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const $i18n = useI18n();
const ipnsStore = useIpnsStore();

const currentRow = ref<IpnsInterface>({} as IpnsInterface);
const modalEditIpnsVisible = ref<boolean>(false);
const modalPublishIpnsVisible = ref<boolean>(false);
const modalDeleteIpnsVisible = ref<boolean>(false);

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
        if (row.ipnsName) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    NEllipsis,
                    { class: 'text-body align-bottom', 'line-clamp': 1 },
                    { default: () => row.ipnsName }
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.ipnsName || '') },
                    h('span', { class: 'icon-copy text-body' }, {})
                  ),
                ],
              }
            ),
          ];
        }
        return '';
      },
    },
    {
      key: 'ipnsValue',
      title: $i18n.t('storage.ipns.link'),
      render(row: IpnsInterface) {
        if (row.link) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    'a',
                    { href: row.link, target: '_blank' },
                    h(
                      NEllipsis,
                      { class: 'text-body align-bottom', 'line-clamp': 1 },
                      { default: () => row.link }
                    )
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.link || '') },
                    h('span', { class: 'icon-copy text-body' }, {})
                  ),
                ],
              }
            ),
          ];
        }
        return '';
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
      title: $i18n.t('general.actions'),
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
                { size: 'small', quaternary: true },
                { default: () => h('span', { class: 'icon-more text-lg' }, {}) }
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
    key: 'publish',
    label: $i18n.t('storage.ipns.publishFile'),
    props: {
      onClick: () => {
        modalPublishIpnsVisible.value = true;
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
