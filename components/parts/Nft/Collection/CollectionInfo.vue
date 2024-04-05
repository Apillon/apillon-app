<template>
  <div class="max-w-xl mx-auto">
    <div v-if="loadingImages || logo || coverImage" class="mb-4 relative min-h-[10rem]">
      <Spinner v-if="loadingImages" />
      <template v-else>
        <Image v-if="coverImage" :src="coverImage.link" class="h-50" />
        <Image
          v-if="logo"
          :src="logo.link"
          class="top-2 left-2 absolute h-20 border-2 border-bg-lighter"
        />
      </template>
    </div>
    <div class="text-center">
      <h2>{{ collectionStore.active.name }}</h2>
      <p>{{ collectionStore.active.description }}</p>
    </div>
    <n-table class="plain" :bordered="false" single-line>
      <tbody>
        <tr v-for="(item, key) in data" :key="key">
          <td>
            <span class="text-white lg:whitespace-nowrap">{{ item.label }}</span>
          </td>
          <td>
            <TableLink v-if="item.link && item.value" :link="item.link" :text="item.value" />
            <TableEllipsis v-else-if="item.value" :text="item.value" />
            <span v-else>{{ item.value }}</span>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
import NftTemplateJPG from 'assets/images/nft/template.jpg';

const { t } = useI18n();
const bucketStore = useBucketStore();
const collectionStore = useCollectionStore();

const loadingImages = ref<boolean>(true);
const logo = ref<BucketItemInterface | undefined>();
const coverImage = ref<BucketItemInterface | undefined>();

onMounted(async () => {
  await bucketStore.fetchDirectoryContent({
    bucketUuid: collectionStore.active.bucket_uuid,
    ...PARAMS_ALL_ITEMS,
  });

  logo.value = bucketStore.folder.items.find(
    item => item.type === BucketItemType.FILE && item.name.includes('logo')
  );
  coverImage.value = bucketStore.folder.items.find(
    item => item.type === BucketItemType.FILE && item.name.includes('cover')
  );

  await sleep(10);
  loadingImages.value = false;
});

const data = computed(() => {
  return [
    {
      label: t('nft.collection.contractAddress'),
      value: collectionStore.active.contractAddress,
      link: contractLink(collectionStore.active.contractAddress, collectionStore.active.chain),
    },
    {
      label: t('nft.collection.uuid'),
      value: collectionStore.active.collection_uuid,
    },
    {
      label: t('nft.collection.baseUri'),
      value: collectionStore.active.baseUri,
    },
    {
      label: t('form.label.collectionCoverImage'),
      value: logo.value?.link,
    },
    {
      label: t('form.label.collectionCoverImage'),
      value: coverImage.value?.link,
    },
  ];
});
</script>
