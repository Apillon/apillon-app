<template>
  <Heading>
    <slot>
      <n-space align="center" size="large">
        <NuxtLink :to="{ name: 'dashboard-service-nft' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <h2>{{ collectionStore.active.name }}</h2>

        <div>
          <TableLink
            class="text-body align-bottom"
            :prefix="$t('nft.collection.contractAddress')"
            :link="
              contractLink(collectionStore.active.contractAddress, collectionStore.active.chain)
            "
            :text="collectionStore.active.contractAddress || ''"
          />
          <TableEllipsis
            :prefix="$t('nft.collection.uuid')"
            :text="collectionStore.active.collection_uuid"
          />
          <TableEllipsis
            :prefix="$t('nft.collection.baseUri')"
            :text="collectionStore.active.baseUri"
          />
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
