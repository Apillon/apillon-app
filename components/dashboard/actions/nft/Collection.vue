<template>
  <n-space class="w-full lg:min-w-52" size="large" vertical>
    <!-- Open Bucket -->
    <n-button
      v-if="collectionStore.active.bucket_uuid && !collectionStore.isUnique"
      class="w-full"
      size="medium"
      :loading="loadingBucket"
      @click="openBucket(collectionStore.active.bucket_uuid)"
      >{{ $t('nft.openBucket') }}
    </n-button>

    <!-- Refresh -->
    <n-button class="w-full" size="medium" :loading="collectionStore.loading" @click="refresh">
      {{ $t('general.refresh') }}
    </n-button>

    <!-- Add IPNS -->
    <n-popconfirm
      v-if="
        collectionStore.active?.collectionStatus === CollectionStatus.DEPLOYED &&
        !!collectionStore.active.bucket_uuid &&
        !!collectionStore.active.cid &&
        !collectionStore.active.ipns_uuid &&
        !collectionStore.isUnique
      "
      @positive-click="createDynamicMetadata()"
    >
      <template #icon> <IconInfo /> </template>
      <template #trigger>
        <n-button class="w-full" size="medium">{{ $t('nft.addIpns') }}</n-button>
      </template>
      {{ $t('nft.addIpnsInfo') }}
    </n-popconfirm>

    <!-- Mint -->
    <n-button
      v-if="collectionStore.active.chainType === ChainType.EVM"
      class="w-full"
      size="medium"
      :disabled="authStore.isAdmin() || actionsDisabled"
      @click="emit('mint')"
    >
      {{ $t('nft.collection.mint') }}
    </n-button>

    <!-- Transfer ownership -->
    <n-button
      v-if="!collectionStore.active.adminAddress"
      class="w-full"
      size="medium"
      :disabled="authStore.isAdmin() || actionsDisabled"
      @click="emit('transfer')"
    >
      {{ $t('nft.collection.transfer') }}
    </n-button>

    <!-- Change base URI -->
    <n-button
      class="w-full"
      size="medium"
      :disabled="authStore.isAdmin() || actionsDisabled"
      @click="emit('setBaseUri')"
    >
      {{ $t('nft.collection.setBaseUri') }}
    </n-button>

    <!-- Add NFT -->
    <Btn
      v-if="
        (collectionStore.active.collection_uuid && collectionStore.active.useIpns !== false) ||
        collectionStore.active.collectionStatus === CollectionStatus.CREATED
      "
      class="w-full"
      inner-class="flex gap-2 items-center"
      size="medium"
      :loading="loadingBucket"
      :disabled="!allowAddMetadata"
      @click="emit('addNfts')"
    >
      <span class="icon-add text-xl"></span>
      <span>{{ $t('nft.add') }}</span>
    </Btn>

    <!-- Burn -->
    <n-button
      v-if="collectionStore.active.isRevokable"
      class="w-full"
      size="medium"
      type="error"
      :disabled="authStore.isAdmin() || actionsDisabled"
      ghost
      @click="emit('revoke')"
    >
      {{ $t('nft.collection.revoke') }}
    </n-button>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  env: { type: Number, default: 0 },
});
const emit = defineEmits(['addNfts', 'mint', 'revoke', 'transfer', 'setBaseUri']);

const message = useMessage();
const authStore = useAuthStore();
const warningStore = useWarningStore();
const collectionStore = useCollectionStore();

const { t } = useI18n();
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

function refresh() {
  collectionStore.fetchCollection(collectionStore.collectionUuid);
  collectionStore.fetchMetadataDeploys(collectionStore.collectionUuid);
  collectionStore.fetchCollectionTransactions(collectionStore.collectionUuid);
}

function createDynamicMetadata() {
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
