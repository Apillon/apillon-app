<template>
  <DataTable
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="websiteStore.loading"
    :pagination="pagination"
    :row-key="rowKey"
    :row-props="rowProps"
    @update:page-size="(pz: number) => (pagination.pageSize = pz)"
  />

  <!-- Modal - Edit website -->
  <modal v-model:show="showModalEditWebsite" :title="$t('hosting.website.edit')">
    <FormHostingWebsite :website-uuid="currentRow.website_uuid" @submit-success="showModalEditWebsite = false" />
  </modal>

  <!-- Modal - Delete Website -->
  <ModalDelete v-model:show="showModalDeleteWebsite" :title="$t('hosting.website.delete')">
    <FormDelete :id="currentRow?.website_uuid" :type="ItemDeleteKey.WEBSITE" @submit-success="onWebsiteDeleted" />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  websites: { type: Array<WebsiteBaseInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();

const { onWebsiteDeleted } = useHosting();
const { availableColumns, selectedColumns, initTableColumns, handleColumnChange } = useTable(
  LsTableColumnsKeys.HOSTING
);

const showModalEditWebsite = ref<boolean>(false);
const showModalDeleteWebsite = ref<boolean>(false);
const pagination = reactive(createPagination(false));

/** Data: filtered websites */
const data = computed<Array<WebsiteBaseInterface>>(() => {
  return props.websites.filter(item => item.name.toLowerCase().includes(websiteStore.search.toLowerCase())) || [];
});

const columns = computed<NDataTableColumns<WebsiteBaseInterface>>(() => {
  return [
    {
      key: 'name',
      title: t('hosting.website.name'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('name') },
      ],
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'website_uuid',
      title: t('hosting.website.uuid'),
      className: { hidden: !selectedColumns.value.includes('website_uuid') },
      render(row: WebsiteBaseInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.website_uuid }, '');
      },
    },
    {
      key: 'domain',
      title: t('hosting.website.domain'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('domain') },
      ],
    },
    {
      key: 'source',
      title: t('hosting.website.source.title'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('source') },
      ],
      minWidth: 120,
      render(row) {
        return [
          h('span', { class: `mr-1 text-lg ${websiteSourceIcon(row)}` }),
          t(`hosting.website.source.${websiteSource(row)}`),
        ];
      },
    },
    // {
    //   key: 'status',
    //   title: t('general.status'),
    //   className: [
    //     { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
    //     { hidden: !selectedColumns.value.includes('status') },
    //   ],
    //   render(row: WebsiteBaseInterface) {
    //     return h(resolveComponent('HostingDeploymentStatus'), { status: row.lastDeploymentStatus });
    //   },
    // },
    {
      key: 'description',
      title: t('hosting.website.description'),
      className: [
        { [ON_COLUMN_CLICK_OPEN_CLASS]: !props.archive },
        { hidden: !selectedColumns.value.includes('description') },
      ],
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'actions',
      align: 'right',
      className: '!py-0 !sticky right-0',
      filter: 'default',
      filterOptionValue: null,
      render() {
        return h(
          NDropdown,
          {
            options: props.archive ? dropdownOptionsArchive : dropdownOptions,
            trigger: 'click',
          },
          {
            default: () => h(resolveComponent('BtnActions')),
          }
        );
      },
      renderFilterIcon: () => {
        return h('span', { class: 'icon-more' }, '');
      },
      renderFilterMenu: () => {
        return h(
          resolveComponent('TableColumns'),
          {
            model: selectedColumns.value,
            columns: availableColumns.value,
            onColumnChange: handleColumnChange,
          },
          ''
        );
      },
    },
  ];
});
const rowKey = (row: WebsiteInterface) => row.website_uuid;
const currentRow = ref<WebsiteBaseInterface>(props.websites[0]);

const websiteSource = (row: WebsiteBaseInterface) => {
  return row.source === WebsiteSource.GITHUB ? 'github' : row.nftCollectionUuid ? 'nft' : 'apillon';
};

const websiteSourceIcon = (row: WebsiteBaseInterface) => {
  return row.source === WebsiteSource.GITHUB ? 'icon-github' : row.nftCollectionUuid ? 'icon-NFTs' : 'icon-file';
};

/** On row click */
const rowProps = (row: WebsiteBaseInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push(`/dashboard/service/hosting/${row.website_uuid}`);
      }
    },
  };
};

const dropdownOptions = [
  {
    key: 'hostingEdit',
    label: t('general.edit'),
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        showModalEditWebsite.value = true;
      },
    },
  },
  {
    key: 'hostingDelete',
    label: t('general.archive'),

    disabled: authStore.isAdmin(),
    props: {
      class: '!text-pink',
      onClick: () => {
        showModalDeleteWebsite.value = true;
      },
    },
  },
];

const dropdownOptionsArchive = [
  {
    key: 'hostingRestore',
    label: t('general.restore'),
    disabled: authStore.isAdmin(),
    props: {
      onClick: () => {
        restoreWebsite();
      },
    },
  },
];

onMounted(() => {
  initTableColumns(columns.value);
});

/**
 * Restore website
 * */
async function restoreWebsite() {
  websiteStore.loading = true;

  try {
    await $api.patch<WebsiteResponse>(endpoints.websiteActivate(currentRow.value.website_uuid));

    websiteStore.archive = websiteStore.archive.filter(item => item.website_uuid !== currentRow.value.website_uuid);

    sessionStorage.removeItem(LsCacheKeys.WEBSITE);
    sessionStorage.removeItem(LsCacheKeys.WEBSITE_ARCHIVE);

    message.success(t('form.success.restored.website'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  websiteStore.loading = false;
}
</script>
