<template>
  <n-scrollbar
    class="mt-10 min-h-[300px] text-left lg:mt-4"
    :style="isXxl ? 'max-height: calc(70dvh - 100px)' : {}"
    y-scrollable
  >
    <template v-if="collectionStore.gridView">
      <div class="grid gap-8" :class="nfts.length > 100 ? 'grid-cols-nftSmall' : 'grid-cols-nft'">
        <div v-for="nft in nfts" :key="nft.id" class="overflow-hidden rounded-xl bg-bg-light">
          <figure class="flex h-full flex-col">
            <Image :src="imageByName(nft.image)" class="h-full w-full object-contain" :alt="nft.name" />
            <figcaption class="block h-12 px-4 py-3 font-bold">
              {{ nft.name }}
            </figcaption>
          </figure>
        </div>
      </div>
      <div v-if="collectionStore.metadata.length > PAGINATION_LIMIT" class="my-4 flex items-center justify-center p-4">
        <n-pagination
          v-model:page="page"
          v-model:page-size="pageSize"
          :page-count="Math.ceil(collectionStore.metadata.length / pageSize)"
          show-size-picker
          :page-sizes="pagination.pageSizes"
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
        @update:page="(page: number) => (pagination.page = page)"
        @update:page-size="
          (pageSize: number) => {
            pagination.pageSize = pageSize;
            pagination.page = 1;
          }
        "
      />
      <Btn
        v-if="collectionStore.amount === NftAmount.SINGLE"
        class="bottom-0 lg:absolute"
        type="secondary"
        size="small"
        @click="addNewNft"
      >
        <strong class="inline-block px-1">{{ $t('nft.addNfts') }}</strong>
      </Btn>
    </div>
  </n-scrollbar>

  <n-space class="mx-auto my-4 w-auto" justify="center">
    <slot />
  </n-space>
</template>

<script lang="ts" setup>
import type { DataTableColumns, DataTableProps } from 'naive-ui';
import { NButton, NInput } from 'naive-ui';
import { NftAmount } from '~/lib/types/nft';
import { PAGINATION_LIMIT } from '~/lib/values/general.values';
import colors from '~/tailwind.colors';

const { t } = useI18n();
const { imageByName } = useNft();
const collectionStore = useCollectionStore();
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
