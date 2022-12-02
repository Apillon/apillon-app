<template>
  <n-data-table :bordered="false" :columns="columns" :data="data" :row-props="rowProps" />

  <!-- Drawer - File details -->
  <n-drawer v-model:show="drawerFileDetailsVisible" :width="495">
    <n-drawer-content> Content </n-drawer-content>
    dibv
  </n-drawer>
</template>

<script lang="ts" setup>
import { sample } from 'lodash';
import { DataTableColumns, NButton, NDropdown, NTag, useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  bucketUuid: { type: String, required: true },
});

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const drawerFileDetailsVisible = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

type RowData = {
  key: number;
  name: string;
  fileCID: string;
  fileSize: string;
  expiration: string;
  replicas: number;
  active: boolean;
};

const createColumns = (): DataTableColumns<RowData> => {
  return [
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      render(row) {
        return [
          h(IconFolderFile, { isFile: row.fileCID ? true : false }, ''),
          h('span', { class: 'ml-2 text-blue' }, row.name),
        ];
      },
    },
    {
      title: $i18n.t('storage.fileCid'),
      key: 'fileCID',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => row.fileCID,
          }
        );
      },
    },
    {
      title: $i18n.t('storage.fileSize'),
      key: 'fileSize',
    },
    {
      title: $i18n.t('storage.expiration'),
      key: 'expiration',
    },
    {
      title: $i18n.t('storage.replicas'),
      key: 'replicas',
    },
    {
      title: $i18n.t('storage.status'),
      key: 'active',
      render(row) {
        return h(
          NTag,
          { type: row.active ? 'success' : 'error', round: true, bordered: false },
          {
            default: () => (row.active ? $i18n.t('general.ok') : $i18n.t('general.error')),
          }
        );
      },
    },
    {
      title: $i18n.t('general.actions'),
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
                { size: 'small', quaternary: true },
                { default: () => h('span', { class: 'icon-more text-lg' }, {}) }
              ),
          }
        );
      },
    },
  ];
};

const currentRow = ref<number>(0);
const data = computed(() => {
  const sampleData = {
    key: 0,
    name: 'filename-longername.pdf',
    fileCID: 'QmXH...',
    fileSize: '10.7MB',
    expiration: '23 Okt 2022',
    replicas: 16,
    active: true,
  };
  if (props.bucketUuid in dataStore.services.folder) {
    return [sampleData, ...dataStore.services.folder[props.bucketUuid]];
  }
  return [sampleData];
});

const columns = createColumns();

function rowProps(row: RowData) {
  return {
    onClick: () => {
      console.log('rowProps');
      currentRow.value = row.key;
    },
  };
}

const dropdownOptions = [
  {
    label: 'Edit ',
    key: 'edit',
    props: {
      onClick: () => {
        drawerFileDetailsVisible.value = true;
      },
    },
  },
  {
    label: 'Delete',
    key: 'delete',
    props: {
      onClick: () => {
        message.error('Delete: ' + JSON.stringify(currentRow.value), {
          icon: () => h('span', { class: 'icon-delete' }, {}),
        });
      },
    },
  },
];

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(_ => {
      getFolders();
    });
  }, 100);
});

async function getFolders() {
  if (!dataStore.hasFolder(props.bucketUuid)) {
    await dataStore.fetchDirectoryContent(props.bucketUuid, $i18n);
  }
}
</script>
