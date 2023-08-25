<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-nft' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2>{{ collectionStore.active.name }}</h2>

        <div>
          <n-space class="" align="center" size="small" :wrap="false">
            <span>{{ $t('nft.collection.address') }}:</span>
            <n-ellipsis class="text-body align-bottom" :line-clamp="1">
              {{ collectionStore.active.contractAddress }}
            </n-ellipsis>
            <button
              class="text-body"
              @click="copyToClipboard(collectionStore.active.contractAddress || '')"
            >
              <span class="icon-copy"></span>
            </button>
          </n-space>
          <n-space class="" align="center" size="small" :wrap="false">
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
        </div>
      </n-space>
    </slot>
    <template #info>
      <n-space :size="32" align="center">
        <IconInfo v-if="$i18n.te('w3Warn.nft.info')" @click="modalW3WarnVisible = true" />
      </n-space>
    </template>
  </Heading>

  <W3Warn v-model:show="modalW3WarnVisible">
    {{ $t('w3Warn.nft.new') }}
  </W3Warn>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const collectionStore = useCollectionStore();
const modalW3WarnVisible = ref<boolean>(false);
</script>
