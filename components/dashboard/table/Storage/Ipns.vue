<template>
  <n-data-table
    remote
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="ipnsStore.loading"
    :pagination="{ pageSize: PAGINATION_LIMIT }"
    :row-props="rowProps"
  />
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis, useMessage } from 'naive-ui';

const $i18n = useI18n();
const ipnsStore = useIpnsStore();

const currentRow = ref<IpnsInterface>({} as IpnsInterface);

/** Columns */
const createColumns = (): NDataTableColumns<IpnsInterface> => {
  return [
    {
      key: 'name',
      title: $i18n.t('storage.ipns.name'),
      minWidth: 200,
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
      title: $i18n.t('storage.ipns.ipnsValue'),
      render(row: IpnsInterface) {
        if (row.ipnsValue) {
          return [
            h(
              'div',
              { class: 'flex' },
              {
                default: () => [
                  h(
                    NEllipsis,
                    { class: 'text-body align-bottom', 'line-clamp': 1 },
                    { default: () => row.ipnsValue }
                  ),
                  h(
                    'button',
                    { class: 'ml-2', onClick: () => copyToClipboard(row.ipnsValue || '') },
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
    key: 'restore',
    label: $i18n.t('general.restore'),
    props: {
      class: '!text-pink',
      onClick: () => {
        restore();
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
 * Restore file
 * 
async function restore() {
  bucketStore.loading = true;

  try {
    const restoredFile = await $api.patch<BucketItemResponse>(
      endpoints.storageFileRestore(bucketStore.bucketUuid, currentRow.value.id)
    );

    removeTrashedFileFromList(restoredFile.data.id);
    message.success($i18n.t('form.success.restored.file'));
  } catch (error) {
    window.$message.error(userFriendlyMsg(error));
  }
  bucketStore.loading = false;
}

function removeTrashedFileFromList(id: number) {
  fileStore.trash = fileStore.trash.filter(item => item.id !== id);
}
*/
</script>
