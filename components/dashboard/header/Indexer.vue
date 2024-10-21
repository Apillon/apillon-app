<template>
  <Heading>
    <slot v-if="!indexerUuid">
      <NuxtLink class="flex items-center gap-x-2" :to="link">
        <span class="icon-back text-2xl align-sub"></span>
        <h1>{{ $t('dashboard.nav.indexing') }}</h1>
      </NuxtLink>
    </slot>
    <slot v-else>
      <n-space align="center" size="large" :wrap="false">
        <NuxtLink :to="{ name: 'dashboard-service-indexing' }">
          <span class="icon-back text-2xl align-sub"></span>
        </NuxtLink>
        <div>
          <h2>{{ indexerStore.active.name }}</h2>
          <TableEllipsis :prefix="$t('indexer.uuid')" :text="indexerStore.active.indexer_uuid" />
        </div>
      </n-space>
    </slot>
    <template #info> </template>

    <template #submenu>
      <MenuIndexer v-if="indexerStore.active" />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
const indexerStore = useIndexerStore();

defineProps({
  link: { type: String, default: '/dashboard/service/indexing' },
  indexerUuid: { type: String, default: '' },
});
</script>
