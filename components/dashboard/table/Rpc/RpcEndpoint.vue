<template>
  <n-data-table
    ref="tableRef"
    v-bind="$attrs"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="rpcEndpointStore.loading"
    :pagination="{
      pageSize: PAGINATION_LIMIT,
      prefix: ({ itemCount }) => $t('general.total', { total: itemCount }),
    }"
    :row-key="rowKey"
    :row-props="rowProps"
  />

  <!-- Modal - Delete API key -->
  <ModalDelete v-model:show="modalDeleteEndpointVisible" :title="$t('rpc.endpoint.delete')">
    <FormDelete
      :id="currentRow?.favoriteData?.id"
      type="rpcEndpoint"
      @submit-success="onRpcEndpointDeleted"
    />
  </ModalDelete>
</template>

<script lang="ts" setup>
import { NButton, NDropdown } from 'naive-ui';

const props = defineProps({
  rpcEndpoints: { type: Array<RpcEndpointInterface>, default: [] },
  allowFavoriteCheck: { type: Boolean, default: false },
});

const $i18n = useI18n();
const { t } = useI18n();
const rpcEndpointStore = useRpcEndpointStore();
const rpcApiKeyStore = useRpcApiKeyStore();

function rowProps(row: RpcEndpointInterface) {
  return {
    onClick: () => {
      currentRow.value = row;
    },
  };
}

const data = computed<Array<RpcEndpointInterface>>(() => {
  if (!props.allowFavoriteCheck) {
    return props.rpcEndpoints;
  }
  return (
    props.rpcEndpoints.filter(endpoint =>
      endpoint.name.toLocaleLowerCase().includes(rpcEndpointStore.search.toLocaleLowerCase())
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
        const chainName = row.favoriteData?.chainName || row.name;
        const children = [h('span', {}, { default: () => chainName })];

        if (row.image_url) {
          children.unshift(h('img', { src: row.image_url, alt: chainName, class: 'w-6 h-6 mr-2' }));
        }
        return h('div', { class: 'flex flex-row gap-1' }, children);
      },
    },
    {
      key: 'networkName',
      minWidth: 100,
      title: t('rpc.endpoint.network'),
      render(row) {
        const networkName = row.favoriteData?.network || row.networkName;
        return h('span', {}, { default: () => networkName });
      },
    },
    {
      key: 'httpsUrl',
      title: t('rpc.endpoint.httpsEndpoint'),
      render(row) {
        if (!row.isFavorite && props.allowFavoriteCheck) {
          return;
        }

        return h(resolveComponent('TableEllipsis'), { text: row?.favoriteData?.httpsUrl }, '');
      },
    },
    {
      key: 'wssUrl',
      title: t('rpc.endpoint.wssEndpoint'),
      render(row) {
        if (!row.isFavorite && props.allowFavoriteCheck) {
          return;
        }

        return h(resolveComponent('TableEllipsis'), { text: row?.favoriteData?.wssUrl }, '');
      },
    },
    {
      key: 'actions',
      title: '',
      className: '!py-0 !sticky right-0',
      width: 200,
      render(row) {
        if (props.allowFavoriteCheck) {
          return h('div', { class: 'w-24 flex justify-center' }, [
            row.isFavorite
              ? h(
                  NButton,
                  {
                    type: 'tertiary',
                    quaternary: true,
                    round: true,
                    onClick: () => (modalDeleteEndpointVisible.value = true),
                  },
                  [
                    h(
                      'span',
                      {
                        class: 'icon-check text-xl text-green mr-2',
                      },
                      {}
                    ),
                    h('span', { class: 'text-green' }, t('rpc.endpoint.added')),
                  ]
                )
              : h(
                  NButton,
                  {
                    type: 'tertiary',
                    quaternary: true,
                    round: true,
                    onClick: () => addRpcEndpoint(row.name, row.networkName),
                  },
                  { default: () => h('span', { class: 'text-primary' }, t('rpc.endpoint.add')) }
                ),
          ]);
        } else {
          return h('div', { class: 'w-24 flex' }, [
            h(
              NDropdown,
              {
                options: dropdownOptions,
                trigger: 'click',
              },
              {
                default: () =>
                  h(
                    NButton,
                    { type: 'tertiary', size: 'small', quaternary: true, round: true },
                    { default: () => h('span', { class: 'icon-more text-2xl' }, {}) }
                  ),
              }
            ),
          ]);
        }
      },
    },
  ];
};

const currentRow = ref<RpcEndpointInterface>({} as RpcEndpointInterface);
const columns = createColumns();
const rowKey = (row: RpcEndpointInterface) => row.id;
const message = useMessage();

const loading = ref<boolean>(false);
const modalDeleteEndpointVisible = ref<boolean>(false);

async function addRpcEndpoint(chainName: string, networkName: string) {
  loading.value = true;
  if (!rpcApiKeyStore.selectedId) {
    return;
  }

  try {
    const bodyData = {
      chainName,
      network: networkName,
      apiKeyId: rpcApiKeyStore.selectedId,
    };

    const res = await $api.post<RpcFavoriteEndpointResponse>(endpoints.rpcUrl(), bodyData);

    message.success($i18n.t('form.success.created.rpcEndpoint'));

    const endpoint = rpcEndpointStore.items.find(
      item => item.name === chainName && item.networkName === networkName
    );
    if (endpoint) {
      endpoint.isFavorite = true;
      endpoint.favoriteData = res.data;
    }
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }

  loading.value = false;
}

const dropdownOptions = [
  {
    key: 'delete',
    label: $i18n.t('general.delete'),
    props: {
      class: '!text-pink',
      onClick: () => {
        modalDeleteEndpointVisible.value = true;
      },
    },
  },
];

function onRpcEndpointDeleted() {
  modalDeleteEndpointVisible.value = false;
  const endpoint = rpcEndpointStore.items.find(item => item.id === currentRow.value.id);

  if (endpoint) {
    endpoint.isFavorite = false;
    endpoint.favoriteData = undefined;
  }
}
</script>
