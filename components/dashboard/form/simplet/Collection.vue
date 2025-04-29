<template>
  <div>
    <Headline
      :title="$t('dashboard.simplet.wizard.selectType')"
      :content="
        collections.length
          ? $t('dashboard.simplet.wizard.collection.info')
          : $t('dashboard.simplet.wizard.collection.empty')
      "
    />
    <template v-if="collections.length">
      <CardSelect
        v-for="(collection, key) in collections"
        :key="key"
        :icon="logoImg(collection.collection_uuid) ? undefined : 'menu/NFTs'"
        :img="logoImg(collection.collection_uuid) || ''"
        :title="collection.name"
        :content="`${collection.maxSupply} ${$t('storage.files')}`"
        :selected="selectedCollection === collection.collection_uuid"
        @click="selectedCollection = collection.collection_uuid"
      />
    </template>
    <Notification v-else type="error" alert>
      {{ $t('dashboard.simplet.wizard.collection.first') }}
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
const simpletsStore = useSimpletsStore();
const collectionStore = useCollectionStore();

const selectedCollection = ref('');
const logos = reactive<Record<string, BucketItemInterface | undefined>>({});

const collections = computed(() => collectionStore.items.filter(c => c.drop && c.dropReserve > 0));

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
    simpletsStore.resetForm();
    simpletsStore.form.collection = selectedCollection.value;
  } else {
    message.warning(t('dashboard.simplet.wizard.selectCollection'));
  }
}
</script>
