<template>
  <n-data-table
    v-if="baseUri"
    :bordered="false"
    :columns="columns"
    :data="nftStore.items"
    :loading="nftStore.loading"
    :pagination="nftStore.pagination"
    :row-key="rowKey"
    remote
    @update:page="(page: number) => handlePageChange(page, nftStore.pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(nftStore.pagination.page, pageSize)"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  baseUri: { type: String, default: null },
  total: { type: Number, default: 0 },
});

const nftStore = useNftStore();

onMounted(() => {
  const parsedUri = new URL(props.baseUri);
  nftStore.baseUri = parsedUri.origin + parsedUri.pathname;
  nftStore.token = parsedUri.search;
  nftStore.pagination.itemCount = props.total;
  handlePageChange();
});

const createColumns = (): NDataTableColumns<MetadataItem> => {
  return (nftStore.items.length ? Object.keys(nftStore.items[0]) : []).map(key => {
    if (key === 'image') {
      return {
        key: key,
        title: key,
        minWidth: 90,
        render(row: MetadataItem) {
          return h('img', { src: row.image, class: 'max-h-16  mx-auto', alt: row.image, title: row.name }, {});
        },
      };
    }
    if (key === 'attributes') {
      return {
        key: key,
        title: key,
        minWidth: 120,
        render(row: MetadataItem) {
          return h(
            'pre',
            { class: 'p-3 -m-3 text-xs overflow-y-auto max-h-32 scrollable' },
            JSON.stringify(row?.attributes || '', undefined, 2)
          );
        },
      };
    }

    return {
      key: key,
      title: key,
      minWidth: 140,
    };
  });
};

const rowKey = (row: MetadataItem) => row.name;
const columns = ref(createColumns());

/** On page change, load data */
async function handlePageChange(page: number = 1, limit: number = PageSize.SM) {
  if (!nftStore.loading) {
    await nftStore.fetchNFTs(page, limit);

    nftStore.pagination.page = page;
    nftStore.pagination.pageSize = limit;
  }
  columns.value = createColumns();
}
</script>
