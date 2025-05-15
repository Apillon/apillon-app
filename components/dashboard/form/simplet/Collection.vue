<template>
  <div>
    <Headline
      :title="$t('simplet.wizard.collection.select')"
      :content="collections.length ? $t('simplet.wizard.collection.info') : $t('simplet.wizard.collection.empty')"
    />
    <Spinner v-if="collectionStore.loading" />
    <template v-else-if="collections.length">
      <CardSelect
        v-for="(collection, key) in collections"
        :key="key"
        :icon="logoImg(collection.collection_uuid) ? undefined : 'menu/NFTs'"
        :img="logoImg(collection.collection_uuid) || ''"
        :content="`${collection.maxSupply} ${$t('storage.files')}`"
        :selected="selectedCollection?.collection_uuid === collection.collection_uuid"
        @click="selectedCollection = collection"
      >
        <template #title>
          <span>
            <strong>{{ collection.name }}</strong>
            <small class="capitalize"> ({{ chainIdToName(collection.chain) }})</small>
          </span>
        </template>
      </CardSelect>
    </template>
    <Notification v-else type="error" alert>
      {{ $t('simplet.wizard.collection.first') }}
      <NuxtLink :to="{ name: 'dashboard-service-nft' }">
        <strong class="underline">{{ $t('dashboard.createHere') }}</strong>
      </NuxtLink>
    </Notification>
  </div>
</template>

<script setup lang="ts">
defineExpose({ nextStep });
const { t } = useI18n();
const message = useMessage();

const bucketStore = useBucketStore();
const simpletStore = useSimpletStore();
const collectionStore = useCollectionStore();

const selectedCollection = ref<CollectionInterface>();
const logos = reactive<Record<string, BucketItemInterface | undefined>>({});

const collections = computed(() =>
  collectionStore.items.filter(
    c =>
      c.drop &&
      c.dropReserve > 0 &&
      c.collectionStatus === CollectionStatus.DEPLOYED &&
      c.collectionType === NFTCollectionType.GENERIC
  )
);

onMounted(async () => {
  await collectionStore.getCollections();

  collections.value.forEach(async c => {
    const files = await bucketStore.fetchDirectoryContent({
      bucketUuid: c.bucket_uuid,
      search: 'logo',
    });
    logos[c.collection_uuid] = files.find(item => item.type === BucketItemType.FILE && item.name.includes('logo'));
  });
});

const logoImg = (uuid: string) => {
  return uuid in logos ? logos[uuid]?.link : '';
};

function nextStep() {
  if (selectedCollection.value) {
    simpletStore.form.collection = selectedCollection.value;

    /** Add logo */
    const uuid = selectedCollection.value.collection_uuid;
    if (uuid in logos) {
      simpletStore.form.collectionLogo = logos[uuid]?.link || '';
    }
  } else {
    message.warning(t('simplet.wizard.selectCollection'));
  }
}
</script>
