<template>
  <div class="flex h-full flex-col justify-between">
    <div class="relative mb-9 min-h-32 w-full flex-auto rounded-lg bg-bg-lighter">
      <Spinner v-if="loadingImages" />
      <template v-else>
        <Image
          v-if="coverImage"
          :src="coverImage.link"
          class="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-lg object-cover object-center"
        />
        <Image
          v-if="logo"
          :src="logo.link"
          class="absolute left-6 top-10 h-28 w-28 rounded-full object-cover object-center"
        />
        <div v-else class="absolute left-6 top-10 h-28 w-28 rounded-full bg-bg-dark" />
      </template>
    </div>
    <n-table class="plain" :bordered="false" single-line>
      <tbody>
        <tr v-for="(item, key) in data" :key="key">
          <td :class="{ '!border-b-0': key + 1 === data.length }">
            <span class="text-white lg:whitespace-nowrap">{{ item.label }}</span>
          </td>
          <td :class="{ '!border-b-0': key + 1 === data.length }">
            <TableLink v-if="item.link && item.value" class="w-full" :link="item.link" :text="item.value" />
            <TableEllipsis v-else-if="item.copy" class="w-full justify-between" :text="item.value" />
            <p v-else class="w-full">{{ item.value }}</p>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
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

  logo.value = bucketStore.folder.items.find(item => item.type === BucketItemType.FILE && item.name.includes('logo'));
  coverImage.value = bucketStore.folder.items.find(
    item => item.type === BucketItemType.FILE && item.name.includes('cover')
  );

  await sleep(10);
  loadingImages.value = false;
});

const data = computed(() => {
  return [
    {
      label: t('nft.collection.name'),
      value: collectionStore.active.name,
    },
    {
      label: t('nft.collection.contractAddress'),
      value: collectionStore.active.contractAddress,
      link: contractLink(collectionStore.active.contractAddress, collectionStore.active.chain),
    },
    {
      label: t('nft.collection.uuid'),
      value: collectionStore.active.collection_uuid,
      copy: true,
    },
    {
      label: t('nft.collection.baseUri'),
      value: collectionStore.active.baseUri,
      copy: true,
    },
  ];
});
</script>
