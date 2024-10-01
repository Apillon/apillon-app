<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="websiteStore.loading"
    :pagination="{
      pageSize: PAGINATION_LIMIT,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
  />

  <!-- Modal - Edit website -->
  <modal v-model:show="showModalEditWebsite" :title="$t('hosting.website.edit')">
    <FormHostingWebsite
      :website-uuid="currentRow.website_uuid"
      @submit-success="showModalEditWebsite = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  websites: { type: Array<WebsiteBaseInterface>, default: [] },
  archive: { type: Boolean, default: false },
});

const { t, te } = useI18n();
const router = useRouter();
const message = useMessage();
const authStore = useAuthStore();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const { deleteItem } = useDelete();
const showModalEditWebsite = ref<boolean>(false);

/** Data: filtered websites */
const data = computed<Array<WebsiteBaseInterface>>(() => {
  return (
    props.websites.filter(item =>
      item.name.toLocaleLowerCase().includes(websiteStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<WebsiteBaseInterface> => {
  return [
    {
      key: 'name',
      title: t('hosting.website.name'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'website_uuid',
      title: t('hosting.website.uuid'),
      render(row: WebsiteBaseInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.website_uuid }, '');
      },
    },
    {
      key: 'domain',
      title: t('hosting.website.domain'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'description',
      title: t('hosting.website.description'),
      className: props.archive ? '' : ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      className: '!py-0 !sticky right-0',
      render() {
        return h(
          NDropdown,
          {
            options: props.archive ? dropdownOptionsArchive : dropdownOptions,
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
const rowKey = (row: WebsiteInterface) => row.website_uuid;
const currentRow = ref<WebsiteBaseInterface>(props.websites[0]);

/** On row click */
const rowProps = (row: WebsiteBaseInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/hosting/${row.website_uuid}` });
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
      onClick: () => {
        deleteWebsite();
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

/**
 * On deleteWebsite click
 * */
async function deleteWebsite() {
  if (
    currentRow.value &&
    (await deleteItem(ItemDeleteKey.WEBSITE, currentRow.value.website_uuid))
  ) {
    websiteStore.items = websiteStore.items.filter(
      item => item.website_uuid !== currentRow.value.website_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.WEBSITE);
    sessionStorage.removeItem(LsCacheKeys.WEBSITE_ARCHIVE);
  }
}

/**
 * Restore website
 * */
async function restoreWebsite() {
  websiteStore.loading = true;

  try {
    await $api.patch<WebsiteResponse>(endpoints.websiteActivate(currentRow.value.website_uuid));

    websiteStore.archive = websiteStore.archive.filter(
      item => item.website_uuid !== currentRow.value.website_uuid
    );

    sessionStorage.removeItem(LsCacheKeys.WEBSITE);
    sessionStorage.removeItem(LsCacheKeys.WEBSITE_ARCHIVE);

    message.success(t('form.success.restored.website'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  websiteStore.loading = false;
}
</script>
