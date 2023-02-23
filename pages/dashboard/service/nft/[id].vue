<template>
  <Dashboard :loading="false">
    <template #heading>
      <HeaderCollection />
    </template>

    <slot>
      <n-space class="pb-8" :size="32" vertical>
        <!-- Actions -->
        <ActionsNftCollection />

        <!-- Table -->
        <TableNftCollection
          v-if="collectionStore.hasCollectionItems && false"
          :collections="collectionStore.items"
        />
        <Empty
          v-else
          :title="$t('nft.collectionsEmpty')"
          :info="$t('nft.collectionsCreate')"
          icon="nft/illustration"
        >
          <Btn type="primary" @click="">
            {{ $t('nft.collection.mint') }}
          </Btn>
        </Empty>
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const { params } = useRoute();
const collectionStore = useCollectionStore();

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
    collectionStore.active = currentCollection;
  }
});
</script>
