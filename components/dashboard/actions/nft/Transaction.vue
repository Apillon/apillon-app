<template>
  <n-space class="w-full lg:min-w-52" size="large" vertical>
    <!-- Open Bucket -->
    <n-button
      v-if="collectionStore.active.bucket_uuid"
      class="w-full"
      size="small"
      :loading="loadingBucket"
      @click="openBucket(collectionStore.active.bucket_uuid)"
    >
      <span class="icon-storage mr-2 text-xl"></span>
      <span>{{ t('nft.openBucket') }}</span>
    </n-button>

    <!-- Refresh -->
    <n-button class="w-full" size="small" :loading="collectionStore.loading" @click="refresh">
      <span class="icon-refresh mr-2 text-xl"></span>
      {{ t('general.refresh') }}
    </n-button>

    <!-- Add IPNS -->
    <n-popconfirm
      v-if="
        collectionStore.active?.collectionStatus === CollectionStatus.DEPLOYED &&
        collectionStore.active.cid &&
        !collectionStore.active.ipns_uuid
      "
      @positive-click="createDynamicMetadata()"
    >
      <template #icon> <IconInfo /> </template>
      <template #trigger>
        <n-button class="w-full" size="small">{{ t('nft.addIpns') }}</n-button>
      </template>
      {{ t('nft.addIpnsInfo') }}
    </n-popconfirm>

    <!-- Add NFT -->
    <n-button
      v-if="
        (collectionStore.active.collection_uuid && collectionStore.active.useIpns !== false) ||
        collectionStore.active.collectionStatus === CollectionStatus.CREATED
      "
      class="w-full"
      size="small"
      :loading="loadingBucket"
      :disabled="!allowAddMetadata"
      @click="openAddNft(collectionStore.active.collection_uuid)"
    >
      <span class="icon-add mr-2 text-xl text-primary"></span>
      <span class="text-primary">{{ t('nft.add') }}</span>
    </n-button>

    <!-- Mint -->
    <n-button class="w-full" size="small" :disabled="authStore.isAdmin() || actionsDisabled" @click="emit('mint')">
      <span class="icon-nft mr-2 text-xl"></span>
      {{ t('nft.collection.mint') }}
    </n-button>
    <n-button
      v-if="collectionStore.active?.collectionType === NFTCollectionType.NESTABLE"
      class="w-full"
      size="small"
      :disabled="authStore.isAdmin() || actionsDisabled"
      @click="emit('nestMint')"
    >
      <span class="icon-nft mr-2 text-xl"></span>
      <span class="inline-block w-full">{{ t('nft.collection.nestMint') }}</span>
    </n-button>
    <n-button class="w-full" size="small" :disabled="authStore.isAdmin() || actionsDisabled" @click="emit('transfer')">
      {{ t('nft.collection.transfer') }}
    </n-button>
    <n-button
      class="w-full"
      size="small"
      :disabled="authStore.isAdmin() || actionsDisabled"
      @click="emit('setBaseUri')"
    >
      {{ t('nft.collection.setBaseUri') }}
    </n-button>
    <n-button
      class="w-full"
      size="small"
      type="error"
      :disabled="authStore.isAdmin() || actionsDisabled"
      ghost
      @click="emit('revoke')"
    >
      <span class="icon-delete mr-2 text-xl text-pink"></span>
      {{ t('nft.collection.revoke') }}
    </n-button>
  </n-space>
</template>

<script lang="ts" setup>
import { CollectionStatus, NFTCollectionType } from '~/lib/types/nft';

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
    (collectionStore.active?.collectionStatus === CollectionStatus.DEPLOYED && isMetadataStoreOnApillon.value)
  );
});

const options = computed(() => {
  return [
    {
      label: t('nft.collection.setBaseUri'),
      key: 'setBaseUri',
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
    const res = await $api.post<CollectionResponse>(endpoints.collectionIpns(collectionStore.active.collection_uuid));

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
