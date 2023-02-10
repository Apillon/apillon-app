<template>
  <n-space class="pb-8" :size="32" vertical>
    <ActionsHosting />

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="webpageStore.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>

  <!-- Modal - Edit webpage -->
  <modal v-model:show="showModalEditWebpage" :title="$t('hosting.webpage.edit')">
    <FormHostingWebpage
      :webpage-id="currentRow.id"
      @submit-success="showModalEditWebpage = false"
    />
  </modal>
</template>

<script lang="ts" setup>
import { NButton, NDropdown, NEllipsis } from 'naive-ui';

const props = defineProps({
  webpages: { type: Array<WebpageInterface>, default: [] },
});

const $i18n = useI18n();
const router = useRouter();
const webpageStore = useWebpageStore();
const settingsStore = useSettingsStore();
const showModalEditWebpage = ref<boolean>(false);

/** Data: filtered webpages */
const data = computed<Array<WebpageInterface>>(() => {
  return (
    props.webpages.filter(item =>
      item.name.toLocaleLowerCase().includes(webpageStore.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<WebpageInterface> => {
  return [
    {
      key: 'name',
      title: $i18n.t('hosting.webpage.name'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h('strong', {}, { default: () => row.name });
      },
    },
    {
      key: 'description',
      title: $i18n.t('hosting.webpage.description'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
      render(row) {
        return h(NEllipsis, { 'line-clamp': 1 }, { default: () => row.description });
      },
    },
    {
      key: 'domain',
      title: $i18n.t('hosting.webpage.domain'),
      className: ON_COLUMN_CLICK_OPEN_CLASS,
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
const currentRow = ref<WebpageInterface>(props.webpages[0]);

/** On row click */
const rowProps = (row: WebpageInterface) => {
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
        showModalEditWebpage.value = true;
      },
    },
  },
];
</script>
