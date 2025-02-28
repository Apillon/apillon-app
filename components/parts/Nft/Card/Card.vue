<template>
  <div v-if="data" class="flex flex-col justify-between rounded-xl bg-white overflow-hidden">
    <figure v-if="image">
      <img
        :src="createThumbnailUrl(image)"
        class="w-full h-full object-contain"
        :alt="image.name"
      />
    </figure>
    <div class="p-4 text-bg">
      <h4>
        <span>#{{ id }}</span>
        {{ data.name }}
      </h4>
      <p>{{ data.description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  id: { type: Number, default: 0 },
  data: { type: Object, default: null },
});

const { createThumbnailUrl } = useNft();
const collectionStore = useCollectionStore();

const image = computed(() => {
  return collectionStore.images.find(img => img.name === props.data.image);
});
</script>
