<template>
  <Heading
    :back="indexerUuid ? { name: 'dashboard-service-indexing' } : undefined"
    docs="https://wiki.apillon.io/web3-services/10-web3-infrastructure.html#indexing-service"
    :service="ServiceTypeName.INDEXING"
  >
    <div v-if="indexerUuid">
      <h3>{{ indexerStore.active.name }}</h3>
      <TableEllipsis :prefix="$t('indexer.uuid')" :text="indexerStore.active.indexer_uuid" />
    </div>
    <NuxtLink v-else class="flex items-center gap-x-2" :to="link">
      <span class="icon-back align-sub text-2xl"></span>
      <h3>{{ $t('dashboard.nav.indexing') }}</h3>
    </NuxtLink>

    <template v-if="indexerStore.active.squid?.api?.urls[0].url" #info>
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
