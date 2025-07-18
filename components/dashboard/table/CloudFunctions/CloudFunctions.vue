<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="cloudFunctionStore.loading"
    :pagination="{
      ...cloudFunctionStore.pagination,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
  />

  <!-- Modal - Edit CloudFunction -->
  <modal v-model:show="modalEditCloudFunctionVisible" :title="$t('computing.cloudFunctions.new')">
    <FormCloudFunctions
      :function-uuid="currentRow.function_uuid"
      @submit-success="modalEditCloudFunctionVisible = false"
    />
  </modal>

  <!-- Modal - Delete -->
  <ModalDelete v-model:show="modalDeleteVisible" :title="$t('computing.cloudFunctions.delete')">
    <FormDelete :id="currentRow.function_uuid" :type="ItemDeleteKey.CLOUD_FUNCTION" @submit-success="onDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  functions: { type: Array<CloudFunctionInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const cloudFunctionStore = useCloudFunctionStore();
const { tableRowCreateTime } = useTable();

const modalDeleteVisible = ref<boolean>(false);
const modalEditCloudFunctionVisible = ref<boolean>(false);
const currentRow = ref<CloudFunctionInterface>(props.functions[0]);
const rowKey = (row: CloudFunctionInterface) => row.function_uuid;

const createColumns = (): NDataTableColumns<CloudFunctionInterface> => {
  return [
    {
      key: 'name',
      title: t('general.name'),
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
      key: 'function_uuid',
      title: t('general.uuid'),
      render(row: CloudFunctionInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.function_uuid }, '');
      },
    },
    tableRowCreateTime,
    {
      key: 'activeJob_id',
      title: t('general.status'),
      render(row) {
        return h(
          resolveComponent('Pill'),
          { type: row.activeJob_id ? 'success' : 'warning', class: 'min-w-16 justify-center' },
          { default: () => (row.activeJob_id ? t('general.active') : t('general.inactive')) }
        );
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
            trigger: 'click',
            options: props.archive ? dropdownOptionsArchive : dropdownOptions.value,
          },
          {
            default: () => h(resolveComponent('BtnActions')),
          }
        );
      },
    },
  ];
};
const columns = createColumns();

/** Data: filtered cloudFunctions */
const data = computed<CloudFunctionInterface[]>(() => {
  return (
    props.functions.filter(item => item.name.toLowerCase().includes(cloudFunctionStore.search.toLowerCase())) || []
  );
});

/**
 * Dropdown Actions
 */
const dropdownOptions = computed(() => {
  return [
    {
      key: 'view',
      label: t('general.view'),
      props: {
        onClick: () => {
          if (!props.archive && currentRow.value) {
            router.push({
              path: `/dashboard/service/cloud-functions/${currentRow.value.function_uuid}`,
            });
          }
        },
      },
    },
    {
      key: 'edit',
      label: t('general.edit'),
      disabled: authStore.isAdmin(),
      props: {
        onClick: () => {
          modalEditCloudFunctionVisible.value = true;
        },
      },
    },
    {
      key: 'delete',
      label: t('general.archive'),
      disabled: authStore.isAdmin(),
      props: {
        class: '!text-pink',
        onClick: () => {
          modalDeleteVisible.value = true;
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
      onClick: () => {
        restoreCloudFunction();
      },
    },
  },
];

/** On row click */
const rowProps = (row: CloudFunctionInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/cloud-functions/${row.function_uuid}` });
      }
    },
  };
};

/**
 * cloudFunction delete
 * */
async function onDeleted() {
  modalDeleteVisible.value = false;
  cloudFunctionStore.items = cloudFunctionStore.items.filter(
    item => item.function_uuid !== currentRow.value?.function_uuid
  );

  sessionStorage.removeItem(LsCacheKeys.CLOUD_FUNCTIONS);
  sessionStorage.removeItem(LsCacheKeys.CLOUD_FUNCTIONS_ARCHIVE);
}

/**
 * Restore cloudFunction
 * */
async function restoreCloudFunction() {
  if (!currentRow.value?.function_uuid) return;

  cloudFunctionStore.loading = true;

  try {
    await $api.patch<CloudFunctionResponse>(endpoints.cloudFunctionActivate(currentRow.value.function_uuid));
    cloudFunctionStore.archive = cloudFunctionStore.archive.filter(
      item => item.function_uuid !== currentRow.value?.function_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.CLOUD_FUNCTIONS);
    sessionStorage.removeItem(LsCacheKeys.CLOUD_FUNCTIONS_ARCHIVE);

    message.success(t('form.success.restored.cloudFunction'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  cloudFunctionStore.loading = false;
}
</script>
