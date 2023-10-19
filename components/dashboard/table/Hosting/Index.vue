<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsHosting />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="websiteStore.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>

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
});

const $i18n = useI18n();
const router = useRouter();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const showModalEditWebsite = ref<boolean>(false);
const TableEllipsis = resolveComponent('TableEllipsis');

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
      title: $i18n.t('hosting.website.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'website_uuid',
      title: $i18n.t('hosting.website.uuid'),
      render(row: WebsiteBaseInterface) {
        return h(TableEllipsis, { text: row.website_uuid }, '');
      },
    },
    {
      key: 'domain',
      title: $i18n.t('hosting.website.domain'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
    },
    {
      key: 'description',
      title: $i18n.t('hosting.website.description'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
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
const rowKey = (row: BucketItemInterface) => row.uuid;
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
    label: $i18n.t('storage.edit'),
    key: 'storageEdit',
    disabled: dataStore.isProjectUser,
    props: {
      onClick: () => {
        showModalEditWebsite.value = true;
      },
    },
  },
];
</script>
