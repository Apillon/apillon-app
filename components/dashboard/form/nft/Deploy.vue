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
const collectionStore = useCollectionStore();
const { createThumbnailUrl, deployCollection } = useNft();

const loading = ref<boolean>(false);

async function deploy() {
  loading.value = true;
  await deployCollection();
  loading.value = false;
}
</script>
