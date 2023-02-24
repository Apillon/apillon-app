<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCollection />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsNftTransaction
          @mint="modalMintCollectionVisible = true"
          @transfer="modalTransferOwnershipVisible = true"
        />

        <!-- Table -->
        <TableNftTransaction
          v-if="collectionStore.hasCollectionTransactions"
          :transactions="collectionStore.transaction"
        />
        <Empty
          v-else
          :title="$t('nft.collectionsEmpty')"
          :info="$t('nft.collectionsCreate')"
          icon="nft/illustration"
        >
          <Btn type="primary" @click="modalMintCollectionVisible = true">
            {{ $t('nft.collection.mint') }}
          </Btn>
        </Empty>

        <NftMintTabs />
      </n-space>

      <!-- Modal - Create Collection -->
      <modal v-model:show="modalMintCollectionVisible" :title="$t('nft.collection.mint')">
        <FormNftMint :collection-uuid="collectionStore.active.collection_uuid" />
      </modal>

      <!-- Modal - Create Collection -->
      <modal v-model:show="modalTransferOwnershipVisible" :title="$t('nft.collection.transfer')">
        <FormNftTransfer :collection-uuid="collectionStore.active.collection_uuid" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const $i18n = useI18n();
const dataStore = useDataStore();
const collectionStore = useCollectionStore();

const pageLoading = ref<boolean>(true);
const modalMintCollectionVisible = ref<boolean | null>(false);
const modalTransferOwnershipVisible = ref<boolean | null>(false);

/** Website ID from route */
const collectionId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(async () => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    const collections = await collectionStore.getCollections();
    const currentCollection = collections.find(item => item.id === collectionId.value);

    if (!currentCollection) {
      router.push({ name: 'dashboard-service-nft' });
    } else {
      await collectionStore.getCollectionTransactions(currentCollection.collection_uuid);
      collectionStore.active = currentCollection;

      pageLoading.value = false;
    }
  });
});
</script>
