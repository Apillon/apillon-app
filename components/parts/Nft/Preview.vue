<template>
  <n-scrollbar
    class="min-h-[300px] mt-10 lg:mt-4 text-left"
    style="max-height: calc(100vh - 420px)"
    y-scrollable
  >
    <template v-if="collectionStore.gridView">
      <div
        class="grid gap-8 grid-cols-nft"
        :class="collectionStore.images.length > 100 ? 'grid-cols-nftSmall' : 'grid-cols-nft'"
      >
        <div v-for="image in images" :key="image.id" class="bg-bg-light rounded-xl overflow-hidden">
          <figure class="flex flex-col h-full">
            <Image
              :src="createThumbnailUrl(image)"
              class="w-full h-full object-contain"
              :alt="image.name"
            />
            <figcaption class="block h-12 px-4 py-3 font-bold">
              {{ image.name }}
            </figcaption>
          </figure>
        </div>
      </div>
      <div
        v-if="collectionStore.images.length > PAGINATION_LIMIT"
        class="flex justify-center items-center p-4 mt-4"
      >
        <n-pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :page-count="Math.ceil(collectionStore.images.length / pageSize)"
          show-size-picker
          :page-sizes="[PAGINATION_LIMIT, 50, 100]"
        />
      </div>
    </template>
    <n-data-table
      v-else
      :columns="columns"
      :data="data"
      :theme-overrides="tableOverrides"
      :pagination="paginationDataTable"
      :row-key="rowKey"
    />
  </n-scrollbar>

  <n-space class="w-auto mx-auto my-4" justify="center">
    <slot />
  </n-space>
</template>

<script lang="ts" setup>
import colors from '~~/tailwind.colors';

const { createThumbnailUrl } = useNft();
const collectionStore = useCollectionStore();

const page = ref<number>(1);
const pageSize = ref<number>(PAGINATION_LIMIT);

/**
 * Table
 */
const paginationDataTable = reactive({
  page: 1,
  pageSize: PAGINATION_LIMIT,
  showSizePicker: true,
  pageSizes: [PAGINATION_LIMIT, 50, 100],
  onChange: (page: number) => {
    paginationDataTable.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationDataTable.pageSize = pageSize;
    paginationDataTable.page = 1;
  },
});

const images = computed(() => {
  const first = (page.value - 1) * pageSize.value;
  let last = first + pageSize.value;
  if (last > collectionStore.images.length) {
    last = collectionStore.images.length;
  }

  return collectionStore.images.slice(first, last);
});

const createColumns = (): NDataTableColumns<Record<string, string>> => {
  return [
    {
      key: 'img',
      render(row) {
        return h(
          resolveComponent('Image') as any,
          { src: imageByName(row.image), class: 'max-w-[60px] max-w-[60px] mx-auto' },
          {}
        );
      },
    },
    {
      key: 'id',
      title: 'ID',
    },
    ...collectionStore.csvColumns,
  ];
};
const columns = createColumns();
const rowKey = (row: TransactionInterface) => row.id;

const data = computed(() => {
  return collectionStore.csvData.map((item, key) => {
    return {
      id: key + 1,
      ...item,
    };
  });
});

function imageByName(name: string = '') {
  const image = collectionStore.images.find(img => img.name === name);
  return image ? createThumbnailUrl(image) : '';
}

/** Theme override */
type TableThemeOverrides = NonNullable<NDataTableProps['themeOverrides']>;
const tableOverrides: TableThemeOverrides = {
  tdTextColor: colors.body,
};
</script>
