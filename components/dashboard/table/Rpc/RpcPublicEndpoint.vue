<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="rpcEndpointStore.loading"
    :theme-overrides="tableOverrides"
    :max-height="250"
    :row-key="rowKey"
  />
</template>

<script lang="ts" setup>
import type { DataTableProps } from 'naive-ui';

const props = defineProps({
  rpcEndpoints: { type: Array<RpcEndpointInterface | RpcFavoriteEndpointInterface>, default: [] },
  allowFavoriteCheck: { type: Boolean, default: false },
});

const { t } = useI18n();
const rpcEndpointStore = useRpcEndpointStore();

const data = computed<Array<RpcEndpointInterface | RpcFavoriteEndpointInterface>>(() => {
  return (
    props.rpcEndpoints.filter(endpoint =>
      endpoint.name.toLowerCase().includes(rpcEndpointStore.publicEndpointsSearch.toLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<RpcEndpointInterface> => {
  return [
    {
      key: 'name',
      title: t('rpc.endpoint.chainName'),
      minWidth: 200,
      render(row) {
        const children = [h('span', {}, { default: () => row.chainName })];

        if (row.image_url) {
          children.unshift(h('img', { src: row.image_url, alt: row.chainName, class: 'w-6 h-6 mr-2' }));
        }
        return h('div', { class: 'flex flex-row gap-1' }, children);
      },
    },
    {
      key: 'networkName',
      minWidth: 100,

      title: t('rpc.endpoint.network'),
    },
  ];
};

const columns = createColumns();
const rowKey = (row: RpcEndpointInterface) => row.networkId;

/** Theme override */
type TableThemeOverrides = NonNullable<DataTableProps['themeOverrides']>;
const tableOverrides: TableThemeOverrides = {
  tdColor: 'transparent',
};
</script>
