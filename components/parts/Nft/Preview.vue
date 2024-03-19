<template>
  <n-scrollbar
    class="min-h-[300px] mt-10 lg:mt-4 text-left"
    style="max-height: calc(100dvh - 420px)"
    y-scrollable
  >
    <template v-if="collectionStore.gridView">
      <div class="grid gap-8" :class="nfts.length > 100 ? 'grid-cols-nftSmall' : 'grid-cols-nft'">
        <div v-for="nft in nfts" :key="nft.id" class="bg-bg-light rounded-xl overflow-hidden">
          <figure class="flex flex-col h-full">
            <Image
              :src="imageByName(nft.image)"
              class="w-full h-full object-contain"
              :alt="nft.name"
            />
            <figcaption class="block h-12 px-4 py-3 font-bold">
              {{ nft.name }}
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
import type { DataTableColumns, DataTableProps } from 'naive-ui';
import colors from '~/tailwind.colors';

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

const nfts = computed(() => {
  const first = (page.value - 1) * pageSize.value;
  let last = first + pageSize.value;
  if (last > collectionStore.metadata.length) {
    last = collectionStore.metadata.length;
  }

  return collectionStore.metadata.slice(first, last);
});

const createColumns = (): DataTableColumns<Record<string, string>> => {
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
    ...collectionStore.columns,
  ];
};
const columns = createColumns();
const rowKey = (row: TransactionInterface) => row.id;

const data = computed(() => {
  return collectionStore.metadata.map((item, key) => {
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
type TableThemeOverrides = NonNullable<DataTableProps['themeOverrides']>;
const tableOverrides: TableThemeOverrides = {
  tdTextColor: colors.body,
};
</script>
