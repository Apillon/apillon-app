<template>
  <div class="flex h-full flex-col justify-between">
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
const simpletStore = useSimpletStore();
const { getSimpletType } = useSimplet();

const loadingImages = ref<boolean>(true);
const collection = ref<CollectionInterface | undefined>();
const logo = ref<BucketItemInterface | undefined>();

onMounted(async () => {
  collection.value = await collectionStore.getCollection(simpletStore.active.contract_uuid);

  if (collection.value) {
    await bucketStore.fetchDirectoryContent({
      bucketUuid: collection.value.bucket_uuid,
      search: 'logo',
    });
    logo.value = bucketStore.folder.items.find(item => item.type === BucketItemType.FILE && item.name.includes('logo'));
  }

  await sleep(10);
  loadingImages.value = false;
});

const data = computed(() => {
  return [
    {
      label: t('form.label.simplet.name'),
      value: simpletStore.active.name,
    },
    {
      label: t('simplet.uuid'),
      value: simpletStore.active.simplet_uuid,
      copy: true,
    },
    {
      label: t('general.status'),
      value: simpletStore.active.frontendStatus,
      component: 'SimpletStatus',
    },
    {
      label: t('general.type'),
      value: getSimpletType(simpletStore.active.simplet_uuid),
    },
    {
      label: t('nft.collection.preview'),
      value: collection.value?.name,
      img: logo.value?.link,
    },
    {
      label: t('general.website'),
      value: simpletStore.active.uu,
      tag: t('general.hosting'),
    },
    {
      label: t('simplet.baseUriendpoint'),
      value: simpletStore.active.backendUrl,
      copy: true,
    },
  ];
});
</script>
