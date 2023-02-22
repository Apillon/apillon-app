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
        <template v-else>
          <n-tabs v-model:value="currentTab" type="segment" animated>
            <n-tab-pane name="uploadMetadata">
              <template #tab>
                <IconNumber :number="1" :active="currentTab === 'uploadMetadata'" />
                <span class="ml-2">{{ $t('nft.collection.uploadMetadata') }}</span>
              </template>
              <slot>
                <FormNftUploadCsvFile />
              </slot>
            </n-tab-pane>
            <n-tab-pane name="uploadImages">
              <template #tab>
                <IconNumber :number="2" :active="currentTab === 'uploadImages'" />
                <span class="ml-2">{{ $t('nft.collection.uploadImages') }}</span>
              </template>
              Hey Jude
            </n-tab-pane>
            <n-tab-pane name="mintNfts">
              <template #tab>
                <IconNumber :number="3" :active="currentTab === 'mintNfts'" />
                <span class="ml-2">{{ $t('nft.collection.mintNfts') }}</span>
              </template>
              Qilixiang
            </n-tab-pane>
          </n-tabs>
        </template>
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const { params } = useRoute();
const collectionStore = useCollectionStore();

/** Active tab value */
const currentTab = ref<string>('uploadMetadata');

/** Website ID from route */
const collectionId = ref<number>(parseInt(`${params?.id}`) || parseInt(`${params?.slug}`) || 0);
watch(
  () => currentTab.value,
  tab => {
    console.log(tab);
  }
);

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
