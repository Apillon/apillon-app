<template>
  <n-scrollbar
    class="min-h-[300px] mt-10 lg:mt-4 text-left"
    style="max-height: calc(70dvh - 100px)"
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
    <div v-else class="relative">
      <n-data-table
        :columns="columns"
        :data="collectionStore.metadata"
        :theme-overrides="tableOverrides"
        :pagination="pagination"
        :row-key="rowKey"
      />
      <Btn
        v-if="collectionStore.amount === NftAmount.SINGLE"
        class="lg:absolute bottom-0"
        type="secondary"
        size="small"
        @click="addNewNft"
      >
        {{ $t('nft.add') }}
      </Btn>
    </div>
  </n-scrollbar>

  <n-space class="w-auto mx-auto my-4" justify="center">
    <slot />
  </n-space>
</template>

<script lang="ts" setup>
import type { DataTableColumns, DataTableProps } from 'naive-ui';
import { NButton, NInput } from 'naive-ui';
import colors from '~/tailwind.colors';

const { t } = useI18n();
const { createThumbnailUrl } = useNft();
const collectionStore = useCollectionStore();

const page = ref<number>(1);
const pageSize = ref<number>(PAGINATION_LIMIT);

/**
 * Table
 */
const pagination = reactive({
  page: 1,
  pageSize: PAGINATION_LIMIT,
  showSizePicker: true,
  pageSizes: [...enumValues(PageSize), 100] as number[],
  prefix: ({ itemCount }) => t('general.total', { total: itemCount }),
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
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

const cols = collectionStore.columns.map(item => {
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
      className: '!py-2',
      width: 120,
      render(row) {
        return h(
          resolveComponent('Image') as any,
          { src: imageByName(row.image), class: 'max-w-[90px] max-w-[60px] mx-auto' },
          {}
        );
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

function imageByName(name: string = '') {
  const image = collectionStore.images.find(img => img.name === name);
  return image ? createThumbnailUrl(image) : '';
}

function addNewNft() {
  collectionStore.nftStep = NftCreateStep.SINGLE;

  /** Reset form */
  collectionStore.form.single.image = '';
  collectionStore.form.single.name = '';
  collectionStore.form.single.description = '';
  collectionStore.form.single.copies = 1;
}

function removeNft(id: number | string) {
  collectionStore.metadata = collectionStore.metadata.filter(nft => nft.id !== Number(id));
}

/** Theme override */
type TableThemeOverrides = NonNullable<DataTableProps['themeOverrides']>;
const tableOverrides: TableThemeOverrides = {
  tdTextColor: colors.body,
};
</script>
