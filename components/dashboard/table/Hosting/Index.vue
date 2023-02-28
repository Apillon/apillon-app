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
      :website-id="currentRow.id"
      @submit-success="showModalEditWebsite = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  websites: { type: Array<WebsiteInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const websiteStore = useWebsiteStore();
const settingsStore = useSettingsStore();
const showModalEditWebsite = ref<boolean>(false);
const TableEllipsis = resolveComponent('TableEllipsis');

/** Data: filtered websites */
const data = computed<Array<WebsiteInterface>>(() => {
  return (
    props.websites.filter(item =>
      item.name.toLocaleLowerCase().includes(websiteStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<WebsiteInterface> => {
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
      render(row: WebsiteInterface) {
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
const rowKey = (row: BucketItemInterface) => row.id;
const currentRow = ref<WebsiteInterface>(props.websites[0]);

/** On row click */
const rowProps = (row: WebsiteInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;

      if (canOpenColumnCell(e.composedPath())) {
        router.push({ path: `/dashboard/service/hosting/${row.id}` });
      }
    },
  };
};

const dropdownOptions = [
  {
    label: $i18n.t('storage.edit'),
    key: 'storageEdit',
    disabled: settingsStore.isProjectUser(),
    props: {
      onClick: () => {
        showModalEditWebsite.value = true;
      },
    },
  },
];
</script>
