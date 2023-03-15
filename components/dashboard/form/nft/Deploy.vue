<template>
  <n-space class="pb-8" :size="32" vertical>
    <div class="grid gap-8 grid-flow-col auto-cols-[minmax(0,250px)]">
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
    const bodyData = {
      metadataSession: collectionStore.csvSession,
      imagesSession: collectionStore.imagesSession,
    };
    await $api.post<any>(endpoints.nftDeploy(collectionStore.active.collection_uuid), bodyData);

    message.success($i18n.t('form.success.nftDeployed'));
  } catch (error) {
    message.error(userFriendlyMsg(error));
  }
  loading.value = false;
}
</script>
