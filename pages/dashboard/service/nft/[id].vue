<template>
  <Dashboard :loading="loading">
    <template #heading>
      <HeaderCollection />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsNftCollection @mint="modalMintCollectionVisible = true" />

        <!-- Table -->
        <TableNftCollection
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
      </n-space>

      <!-- Modal - Create Collection -->
      <modal v-model:show="modalMintCollectionVisible" :title="$t('nft.collection.mint')">
        <FormNftMint :collection-uuid="collectionStore.active.collection_uuid" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const { params } = useRoute();
const $i18n = useI18n();
const collectionStore = useCollectionStore();

const loading = ref<boolean>(true);
const modalMintCollectionVisible = ref<boolean | null>(false);

/** Website ID from route */
const collectionId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(async () => {
  const collections = await collectionStore.getCollections();
  const currentCollection = collections.find(item => item.id === collectionId.value);

  if (!currentCollection) {
    router.push({ name: 'dashboard-service-nft' });
  } else {
    const transactions = await collectionStore.getCollectionTransactions(
      currentCollection.collection_uuid
    );
    console.log(transactions);

    collectionStore.active = currentCollection;

    loading.value = false;
  }
});
</script>
