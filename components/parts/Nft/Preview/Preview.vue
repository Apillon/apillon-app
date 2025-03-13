<template>
  <n-scrollbar class="has-scrollbar min-h-[300px]" :style="isXxl ? 'max-height: calc(92dvh - 205)' : {}" y-scrollable>
    <div class="mb-6 flex items-center justify-between">
      <h5 class="text-center">{{ $t('nft.collection.preview') }}</h5>
      <NftPreviewSwitch />
    </div>
    <template v-if="metadataStore.gridView">
      <div class="grid gap-8" :class="nfts.length > 100 ? 'grid-cols-nftSmall' : 'grid-cols-nft'">
        <NftCard v-for="nft in nfts" :key="nft.id" :name="`${nft.name}`" :image="`${nft.image}`" />
      </div>
      <div v-if="metadataStore.metadata.length > PAGINATION_LIMIT" class="my-4 flex items-center justify-center p-4">
        <n-pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :page-count="Math.ceil(metadataStore.metadata.length / pageSize)"
          show-size-picker
          :page-sizes="pagination.pageSizes"
        />
      </div>
    </template>
    <div v-else class="relative">
      <n-data-table
        :columns="columns"
        :bordered="false"
        :data="metadataStore.metadata"
        :loading="metadataStore.loading"
        :pagination="pagination"
        :row-key="rowKey"
        @update:page="(page: number) => (pagination.page = page)"
        @update:page-size="
          (pageSize: number) => {
            pagination.pageSize = pageSize;
            pagination.page = 1;
          }
        "
      />
    </div>
    <slot />
  </n-scrollbar>
</template>

<script lang="ts" setup>
import type { DataTableColumns } from 'naive-ui';
import { NButton, NInput } from 'naive-ui';
import { PAGINATION_LIMIT } from '~/lib/values/general.values';

const { imageByName } = useMetadata();
const metadataStore = useMetadataStore();
const { isXxl } = useScreen();

const page = ref<number>(1);
const pageSize = ref<number>(PAGINATION_LIMIT);

/**
 * Table
 */
const pagination = reactive(createPagination(false));

const nfts = computed(() => {
  const first = (page.value - 1) * pageSize.value;
  let last = first + pageSize.value;
  if (last > metadataStore.metadata.length) {
    last = metadataStore.metadata.length;
  }

  return metadataStore.metadata.slice(first, last);
});

const cols = metadataStore.columns.map(item => {
  const key = item?.title || item?.key || '';

  if (key === 'id') return { key: key, title: key, minWidth: 50 };
  if (key === 'image') return { key: key, title: key, minWidth: 80 };

  return {
    key: key,
    title: key,
    minWidth: 140,
    render(row) {
      return h(NInput, {
        value:
          key in row
            ? row[key]
            : row.attributes.find(attrItem => attrItem.trait_type === key)
              ? row.attributes.find(attrItem => attrItem.trait_type === key).value
              : null,
        onUpdateValue(v) {
          if (key in row) {
            row[key] = v;
          } else if (row.attributes.find(attrItem => attrItem.trait_type === key)) {
            row.attributes.find(attrItem => attrItem.trait_type === key).value = v;
          }
        },
      });
    },
  };
});

const createColumns = (): DataTableColumns<Record<string, string>> => {
  return [
    {
      key: 'img',
      width: 88,
      render(row) {
        return h(resolveComponent('Image') as any, { src: imageByName(row.image), class: 'max-h-16  mx-auto' }, {});
      },
    },
    ...cols,
    {
      key: 'action_remove',
      title: '',
      align: 'right',
      render(row) {
        return h(
          NButton,
          { size: 'small', type: 'error', ghost: true, onClick: () => removeNft(row?.id || 0) },
          h('span', { class: 'icon-delete text-lg' }, '')
        );
      },
    },
  ];
};

const columns = createColumns();
const rowKey = (row: TransactionInterface) => row.id;

function removeNft(id: number | string) {
  metadataStore.metadata = metadataStore.metadata.filter(nft => nft.id !== Number(id));
}
</script>
