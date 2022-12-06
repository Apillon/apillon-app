<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="dataStore.currentFolderContent"
    :loading="tableLoading"
    :pagination="{ pageSize: 10 }"
    :row-key="rowKey"
    @update:checked-row-keys="handleCheck"
    :row-props="rowProps"
  />

  <!-- Drawer - File details -->
  <n-drawer v-model:show="drawerFileDetailsVisible" :width="495">
    <n-drawer-content v-if="fileDetails.file">
      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.fileName') }}</p>
        <strong>{{ fileDetails.file.name }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.fileCid') }}</p>
        <strong>{{ fileDetails.file.CID }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.fileSize') }}</p>
        <strong>{{ formatBytes(fileDetails.file.size) }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.expiration') }}</p>
        <strong>{{ fileDetails.crustStatus.expired_at }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.replicas') }}</p>
        <strong>{{ fileDetails.crustStatus.reported_replica_count }}</strong>
      </div>

      <div class="body-sm mb-4">
        <p class="body-sm">{{ $t('storage.status') }}</p>
        <n-tag v-if="fileDetails.file.status === 5" type="success" :bordered="false" round>{{
          $t('general.ok')
        }}</n-tag>
        <n-tag v-else type="error" :bordered="false" round>{{ $t('general.error') }}</n-tag>
      </div>

      <div class="mb-4">
        <p class="body-sm">{{ $t('general.actions') }}</p>
      </div>
      <Btn type="secondary" size="large">{{ $t('storage.renewPoolBalance') }}</Btn>
    </n-drawer-content>
    <AnimationLoader v-else />
  </n-drawer>

  <!-- Modal - Delete folder -->
  <n-modal v-model:show="showModalFolderDelete">
    <n-card
      style="width: 660px"
      :title="$t('storage.folderDelete')"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <FormStorageFolderDelete :folder-id="currentRow?.id || 0" @submit-success="onFolderDeleted" />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { DataTableColumns, DataTableRowKey, NButton, NDropdown, NTag } from 'naive-ui';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  bucketUuid: { type: String, required: true },
  search: { type: String, required: true },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const tableLoading = ref<boolean>(false);
const showModalFileDelete = ref<boolean>(false);
const showModalFolderDelete = ref<boolean>(false);
const drawerFileDetailsVisible = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

type RowData = {
  id: number;
  key: number;
  name: string;
  CID: string;
  size: number;
  expiration: string;
  replicas: number;
  active: boolean;
  type: string;
};

const createColumns = (): DataTableColumns<FolderInterface> => {
  return [
    {
      type: 'selection',
    },
    {
      title: $i18n.t('storage.fileName'),
      key: 'name',
      render(row) {
        return [
          h(IconFolderFile, { isFile: row.type === 'file' }, ''),
          h(
            'span',
            {
              class: 'ml-2 text-blue cursor-pointer',
              onClick: () => onItemOpen(row),
            },
            row.name
          ),
        ];
      },
    },
    {
      title: $i18n.t('storage.fileCid'),
      key: 'CID',
      render(row) {
        return h(
          'span',
          { class: 'text-grey' },
          {
            default: () => truncateCid(row.CID || ''),
          }
        );
      },
    },
    {
      title: $i18n.t('storage.fileSize'),
      key: 'size',
      render(row) {
        return h('span', {}, { default: () => formatBytes(row.size || 0) });
      },
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
          { type: row.id ? 'success' : 'error', round: true, bordered: false },
          {
            default: () => (row.id ? $i18n.t('general.ok') : $i18n.t('general.error')),
          }
        );
      },
    },
    {
      title: $i18n.t('general.actions'),
      key: 'actions',
      align: 'right',
      className: '!py-0',
      render(row) {
        return h(
          NDropdown,
          {
            options: row.type === 'file' ? dropdownFileOptions : dropdownFolderOptions,
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

const currentRow = ref<FolderInterface>({} as FolderInterface);
const selectedRows = ref<DataTableRowKey[]>([]);
const fileDetails = ref<FileDetailsInterface>({} as FileDetailsInterface);

const rowKey = (row: FolderInterface) => row.id;

const handleCheck = (rowKeys: DataTableRowKey[]) => {
  selectedRows.value = rowKeys;
};

function rowProps(row: FolderInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

/** Action when user click on File/Folder name */
async function onItemOpen(row: FolderInterface) {
  if (row.type === 'file') {
    drawerFileDetailsVisible.value = true;

    /** Fetch file details */
    fileDetails.value = await dataStore.fetchFileDetails(
      'bb8f6e06-0b2b-4393-8f21-1bc476823996',
      $i18n
    );
  } else if (row.type === 'directory') {
    tableLoading.value = true;
    await dataStore.fetchDirectoryContent($i18n, props.bucketUuid, row.id);
    tableLoading.value = false;
  } else {
    console.warn("Unknown item type: it should be of type 'file' or 'directory'!");
  }
}

const dropdownFolderOptions = [
  {
    label: $i18n.t('general.open'),
    key: 'open',
    props: {
      onClick: () => {},
    },
  },
  {
    label: $i18n.t('general.delete'),
    key: 'delete',
    props: {
      onClick: () => {
        showModalFolderDelete.value = true;
      },
    },
  },
];
const dropdownFileOptions = [
  {
    label: $i18n.t('general.view'),
    key: 'view',
    props: {
      onClick: () => {
        drawerFileDetailsVisible.value = true;
      },
    },
  },
  {
    label: $i18n.t('general.delete'),
    key: 'delete',
    props: {
      onClick: () => {
        showModalFileDelete.value = true;
      },
    },
  },
];

/**
 * Load data on mounted
 */
onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      tableLoading.value = true;
      await dataStore.fetchDirectoryContent($i18n);
      tableLoading.value = false;
    });
  }, 100);
});

async function onFolderDeleted() {
  tableLoading.value = true;

  showModalFolderDelete.value = false;
  await dataStore.fetchDirectoryContent($i18n);

  tableLoading.value = false;
}
</script>
