<template>
  <n-space class="pb-8" :size="32" vertical>
    <div class="grid gap-8 grid-cols-nft">
      <div v-for="image in collectionStore.images" :key="image.id">
        <figure class="flex flex-col h-full">
          <img
            :src="createThumbnailUrl(image)"
            class="w-full h-full object-contain"
            :alt="image.name"
          />
          <figcaption class="block h-12 px-4 py-3 bg-white text-bg font-bold">
            {{ image.name }}
          </figcaption>
        </figure>
      </div>
    </div>
    <n-space justify="space-between">
      <div></div>
      <Btn type="primary" :loading="loading" @click="deploy">
        {{ $t('nft.upload.deploy') }}
      </Btn>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const collectionStore = useCollectionStore();
const { uploadFiles } = useUpload();

const loading = ref<boolean>(false);

function createThumbnailUrl(file: FileListItemType): string {
  if (file.file) {
    return window.URL.createObjectURL(file.file);
  }
  return '';
}

/**
 * Deploy NFT with metadata
 */
async function deploy() {
  loading.value = true;
  try {
    const metadataSession = await uploadMetadata();
    const imagesSession = await uploadImages();

    const res = await $api.post<CollectionResponse>(
      endpoints.nftDeploy(collectionStore.active.collection_uuid),
      { metadataSession, imagesSession }
    );
    collectionStore.active = res.data;

    message.success($i18n.t('form.success.nftDeployed'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}

async function uploadImages() {
  return await uploadFiles(
    collectionStore.active.bucket_uuid,
    collectionStore.images,
    false,
    true,
    false
  );
}

async function uploadMetadata() {
  const nftMetadataFiles = createNftFiles(collectionStore.metadata);

  return await uploadFiles(
    collectionStore.active.bucket_uuid,
    nftMetadataFiles,
    false,
    true,
    false
  );
}

/**
 * Prepare NFT files: parse NFT data to JSON files
 */
function createNftFiles(nftData: Array<Record<string, any>>): FileListItemType[] {
  return nftData.map((nft, index) => {
    const nftFile = new Blob([JSON.stringify(nft, null, 2)], {
      type: 'application/json',
    });

    return {
      id: `${index + 1}-${nft.name}`,
      name: `${index + 1}.json`,
      status: 'pending',
      percentage: 0,
      file: nftFile,
      type: nftFile.type,
      size: nftFile.size || 0,
      timestamp: Date.now(),
      onFinish: () => {},
      onError: () => {},
    } as FileListItemType;
  });
}
</script>
