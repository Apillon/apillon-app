<template>
  <div>
    <div class="mb-4 relative max-w-lg mx-auto min-h-[10rem]">
      <Image v-if="coverImage" :src="coverImage.link" class="h-50" />
      <Image v-else :src="NftTemplateJPG" class="h-50" />
      <Image
        v-if="logo"
        :src="logo.link"
        class="top-2 left-2 absolute h-20 border-2 border-bg-lighter"
      />
      <Logo
        v-else
        class="flex-cc top-2 left-2 absolute p-2 h-20 border-2 border-bg-lighter bg-bg/40"
      ></Logo>
    </div>
    <div class="text-center">
      <h2>{{ collectionStore.active.name }}</h2>
      <p>{{ collectionStore.active.description }}</p>
    </div>
    <n-table class="plain" :bordered="false" single-line>
      <tbody>
        <tr>
          <td>
            <span class="text-white">{{ $t('nft.collection.contractAddress') }}</span>
          </td>
          <td>
            <TableLink
              v-if="collectionStore.active.contractAddress"
              :link="
                contractLink(collectionStore.active.contractAddress, collectionStore.active.chain)
              "
              :text="collectionStore.active.contractAddress || ''"
            />
          </td>
        </tr>
        <tr>
          <td>
            <span class="text-white">{{ $t('nft.collection.uuid') }}</span>
          </td>
          <td>
            <TableEllipsis :text="collectionStore.active.collection_uuid" />
          </td>
        </tr>
        <tr>
          <td>
            <span class="text-white">{{ $t('nft.collection.baseUri') }}</span>
          </td>
          <td>
            <TableEllipsis :text="collectionStore.active.baseUri" />
          </td>
        </tr>
      </tbody>
    </n-table>

    <!-- <TableLink
      v-if="collectionStore.active.contractAddress"
      class="text-body align-bottom"
      :prefix="$t('nft.collection.contractAddress')"
      :link="contractLink(collectionStore.active.contractAddress, collectionStore.active.chain)"
      :text="collectionStore.active.contractAddress || ''"
    />
    <TableEllipsis
      :prefix="$t('nft.collection.uuid')"
      :text="collectionStore.active.collection_uuid"
    />
    <TableEllipsis :prefix="$t('nft.collection.baseUri')" :text="collectionStore.active.baseUri" /> -->
  </div>
</template>

<script lang="ts" setup>
import NftTemplateJPG from 'assets/images/nft/template.jpg';

const bucketStore = useBucketStore();
const collectionStore = useCollectionStore();

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
});
</script>
