<template>
  <div class="overflow-hidden rounded-xl bg-bg-light">
    <figure class="flex h-full flex-col">
      <Image
        v-if="typeof image === 'string'"
        :src="imageByName(image)"
        class="h-full max-h-60 w-full object-contain"
        :alt="image"
      />
      <Image
        v-else-if="image?.file"
        :src="createThumbnailUrl(image as FileListItemType)"
        class="h-full max-h-60 w-full object-contain"
        :alt="image.name"
      />

      <figcaption
        v-if="name || image || description"
        class="flex min-h-14 items-center justify-between gap-2 px-4 py-1"
      >
        <div>
          <n-ellipsis v-if="name || image" class="break-all align-bottom text-sm font-semibold" :line-clamp="2">
            {{ name || typeof image === 'string' ? image : image?.name }}
          </n-ellipsis>
          <p v-if="description">{{ description }}</p>
        </div>
        <button v-if="hasRemove" class="flex-cc p-1" @click="$emit('remove')">
          <span class="icon-delete text-xl"></span>
        </button>
      </figcaption>
    </figure>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from 'vue';

defineEmits(['remove']);
defineProps({
  name: { type: String, default: null },
  description: { type: String, default: null },
  image: { type: [String, Object], default: null },
});

const { vnode } = getCurrentInstance();
const { createThumbnailUrl, imageByName } = useMetadata();

const hasRemove = computed(() => 'onRemove' in vnode.props);
</script>
