<template>
  <Heading>
    <slot v-if="!indexerUuid">
      <NuxtLink class="flex items-center gap-x-2" :to="link">
        <span class="icon-back align-sub text-2xl"></span>
        <h1>{{ $t('dashboard.nav.indexing') }}</h1>
      </NuxtLink>
    </slot>
    <slot v-else>
      <n-space align="center" size="large" :wrap="false">
        <NuxtLink :to="{ name: 'dashboard-service-indexing' }">
          <span class="icon-back align-sub text-2xl"></span>
        </NuxtLink>
        <div>
          <h2>{{ indexerStore.active.name }}</h2>
          <TableEllipsis :prefix="$t('indexer.uuid')" :text="indexerStore.active.indexer_uuid" />
        </div>
      </n-space>
    </slot>
    <template #info>
      <ApiLink :title="$t('indexer.indexerApiEndpoint')" :url="indexerStore.active.squid?.api?.urls[0].url" />
    </template>

    <template #submenu>
      <MenuIndexer v-if="indexerStore.active" />
    </template>
  </Heading>
</template>

<script lang="ts" setup>
defineProps({
  link: { type: String, default: '/dashboard/service/indexing' },
  indexerUuid: { type: String, default: '' },
});

const indexerStore = useIndexerStore();
</script>
