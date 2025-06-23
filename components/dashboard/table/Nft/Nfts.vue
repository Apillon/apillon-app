<template>
  <n-data-table
    v-if="baseUri"
    :bordered="false"
    :columns="columns"
    :data="nfts"
    :loading="loading"
    :pagination="pagination"
    :row-key="rowKey"
    remote
    @update:page="(page: number) => handlePageChange(page, pagination.pageSize)"
    @update:page-size="(pageSize: number) => handlePageChange(pagination.page, pageSize)"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  baseUri: { type: String, default: null },
  total: { type: Number, default: 0 },
});
const message = useMessage();

const uri = new URL(props.baseUri);
const loading = ref<boolean>(false);
const nfts = ref<MetadataItem[]>([]);
const pagination = reactive(createPagination());

onMounted(() => {
  pagination.itemCount = props.total;
  handlePageChange();
});

const createColumns = (): NDataTableColumns<MetadataItem> => {
  return (nfts.value.length ? Object.keys(nfts.value[0]) : []).map(key => {
    const col = { key: key, title: key };
    if (key === 'image') {
      return {
        ...col,
        minWidth: 90,
        render(row: MetadataItem) {
          return h('img', { src: row.image, class: 'max-h-16  mx-auto', alt: row.image, title: row.name }, {});
        },
      };
    }
    if (key === 'attributes') {
      return {
        ...col,
        render(row: MetadataItem) {
          return h(
            'pre',
            { class: 'p-3 -m-3 text-xs overflow-y-auto max-h-32 scrollable' },
            JSON.stringify(row?.attributes || '', undefined, 2)
          );
        },
      };
    }

    return col;
  });
};

const columns = ref(createColumns());
const rowKey = (row: MetadataItem) => row.name;
const loadMetadata = async (url: string): Promise<MetadataItem> => await (await fetch(url)).json();

/** On page change, load data */
async function handlePageChange(page: number = 1, limit: number = PageSize.SM) {
  if (!loading.value) {
    nfts.value = await fetchNFTs(page, limit);
    pagination.page = page;
    pagination.pageSize = limit;
  }
  columns.value = createColumns();
}

async function fetchNFTs(page = 1, limit = PageSize.SM): Promise<MetadataItem[]> {
  loading.value = true;
  try {
    const data: Record<number, MetadataItem> = {};
    await Promise.all(
      Array.from({ length: limit }).map(async (v, i) => {
        const id = (page - 1) * limit + i + 1;
        if (id <= Number(pagination.itemCount || 0)) {
          data[id] = await loadMetadata(`${uri.origin}${uri.pathname}${id}.json/${uri.search}`).catch();
        }
      })
    );
    loading.value = false;
    return Object.values(data).filter(d => !!d);
  } catch (error: any) {
    /** Show error message */
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
  return [];
}
</script>
