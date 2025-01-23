<template>
  <n-space justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <!-- <n-input
          v-model:value="collectionStore.search"
          type="text"
          name="search"
          size="small"
          :placeholder="$t('general.search')"
          clearable
        >
          <template #prefix>
            <span class="icon-search text-2xl"></span>
          </template>
        </n-input> -->
    </div>

    <n-space size="large">
      <!-- Open Bucket -->
      <n-button
        v-if="collectionStore.active.bucket_uuid"
        size="small"
        :loading="loadingBucket"
        @click="openBucket(collectionStore.active.bucket_uuid)"
      >
        <span class="icon-storage text-xl mr-2"></span>
        <span>{{ $t('nft.openBucket') }}</span>
      </n-button>

      <!-- Refresh -->
      <n-button size="small" :loading="collectionStore.loading" @click="refresh">
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Add IPNS -->
      <n-popconfirm
        v-if="
          collectionStore.active?.collectionStatus === CollectionStatus.DEPLOYED &&
          collectionStore.active.cid &&
          !collectionStore.active.ipns_uuid &&
          !collectionStore.isUnique
        "
        @positive-click="createDynamicMetadata()"
      >
        <template #icon> <IconInfo /> </template>
        <template #trigger>
          <n-button size="small">{{ $t('nft.addIpns') }}</n-button>
        </template>
        {{ $t('nft.addIpnsInfo') }}
      </n-popconfirm>

      <!-- Add NFT -->
      <n-button
        v-if="collectionStore.active.collection_uuid && collectionStore.active.useIpns !== false"
        size="small"
        :loading="loadingBucket"
        :disabled="!allowAddMetadata"
        @click="openAddNft(collectionStore.active.collection_uuid)"
      >
        <span class="icon-add text-xl mr-2 text-primary"></span>
        <span class="text-primary">{{ $t('nft.add') }}</span>
      </n-button>

      <!-- Actions -->
      <n-dropdown
        :key="collectionStore.active.collectionStatus"
        placement="bottom-end"
        trigger="click"
        :options="options"
        :disabled="authStore.isAdmin()"
      >
        <n-button size="small">
          <span class="text-primary">{{ $t('general.actions') }}</span>
          <div class="hidden md:flex items-center relative left-1">
            <span class="icon-down text-2xl text-primary"></span>
          </div>
        </n-button>
      </n-dropdown>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  env: { type: Number, default: 0 },
});
const emit = defineEmits(['mint', 'nestMint', 'revoke', 'transfer', 'setBaseUri']);

const message = useMessage();
const authStore = useAuthStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { t } = useI18n();
const { openAddNft } = useCollection();
const { loadingBucket, openBucket } = useStorage();

const actionsDisabled = computed<boolean>(() => {
  return collectionStore.active?.collectionStatus !== CollectionStatus.DEPLOYED;
});

const isMetadataStoreOnApillon = computed<boolean>(() => {
  const baseUri = collectionStore.active?.baseUri || '';
  return (
    !!collectionStore.active.useApillonIpfsGateway ||
    !!collectionStore.active.ipns_uuid ||
    !baseUri.startsWith('ipfs://')
  );
});

const allowAddMetadata = computed<boolean>(() => {
  return (
    collectionStore.active?.collectionStatus === CollectionStatus.CREATED ||
    (collectionStore.active?.collectionStatus === CollectionStatus.DEPLOYED &&
      isMetadataStoreOnApillon.value)
  );
});

const options = computed(() => {
  return [
    {
      label: t('nft.collection.mint'),
      key: 'mint',
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('mint');
          }
        },
      },
    },
    {
      label: t('nft.collection.nestMint'),
      key: 'nestMint',
      show: collectionStore.active?.collectionType === NFTCollectionType.NESTABLE,
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('nestMint');
          }
        },
      },
    },
    {
      label: t('nft.collection.revoke'),
      key: 'revoke',
      disabled: actionsDisabled.value || !collectionStore.active?.isRevokable,
      props: {
        onClick: () => {
          if (!actionsDisabled.value && !!collectionStore.active?.isRevokable) {
            emit('revoke');
          }
        },
      },
    },
    {
      label: t('nft.collection.transfer'),
      key: 'transfer',
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('transfer');
          }
        },
      },
    },
    {
      label: t('nft.collection.setBaseUri'),
      key: 'setBaseUri',
      show: !collectionStore.isUnique,
      disabled: actionsDisabled.value,
      props: {
        onClick: () => {
          if (!actionsDisabled.value) {
            emit('setBaseUri');
          }
        },
      },
    },
  ];
});

function refresh() {
  collectionStore.fetchCollection(collectionStore.collectionUuid);
  collectionStore.fetchMetadataDeploys(collectionStore.collectionUuid);
  collectionStore.fetchCollectionTransactions(collectionStore.collectionUuid);
}

async function createDynamicMetadata() {
  const priceServiceName = generatePriceServiceName(
    ServiceTypeName.NFT,
    collectionStore.active.chain,
    PriceServiceAction.SET_BASE_URI
  );
  warningStore.showSpendingWarning([PriceServiceName.IPNS, priceServiceName], () => createIpns());
}
async function createIpns() {
  try {
    const res = await $api.post<CollectionResponse>(
      endpoints.collectionIpns(collectionStore.active.collection_uuid)
    );

    /** Update collection data in store */
    collectionStore.active = res.data;
    collectionStore.items.forEach(item => {
      if (item.collection_uuid === res.data.collection_uuid) {
        item.baseUri = res.data.baseUri;
      }
    });

    message.success(t('form.success.created.ipns'));

    collectionStore.fetchCollectionTransactions(collectionStore.collectionUuid);
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
}
</script>
