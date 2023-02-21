<template>
  <Heading>
    <slot>
      <n-space align="center" :size="32">
        <NuxtLink :to="{ name: 'dashboard-service-nft' }">
          <span class="icon-back"></span>
        </NuxtLink>
        <h4>{{ collectionStore.active.name }}</h4>

        <n-space align="center" size="small" :wrap="false">
          <span>{{ $t('nft.collection.uuid') }}:</span>
          <n-ellipsis class="text-body align-bottom" :line-clamp="1">
            {{ collectionStore.active.collection_uuid }}
          </n-ellipsis>
          <button
            class="text-body"
            @click="copyToClipboard(collectionStore.active.collection_uuid)"
          >
            <span class="icon-copy"></span>
          </button>
        </n-space>
      </n-space>
    </slot>
  </Heading>
</template>

<script lang="ts" setup>
const collectionStore = useCollectionStore();
</script>
