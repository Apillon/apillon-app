<template>
  <div class="flex h-full flex-col justify-between">
    <div class="relative mb-9 min-h-32 w-full flex-auto rounded-lg bg-bg-lighter">
      <Spinner v-if="loading" />
      <template v-else>
        <Image
          v-if="coverImage"
          :src="coverImage"
          class="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-lg object-cover object-center"
        />
        <Image
          v-if="logoImage"
          :src="logoImage"
          class="absolute left-6 top-10 h-28 w-28 rounded-full object-cover object-center"
        />
        <div v-else class="absolute left-6 top-10 h-28 w-28 rounded-full bg-bg-dark" />
      </template>
    </div>
    <TableInfo :data="data" />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  baseUriLink: { type: String, default: null },
  coverImage: { type: String, default: null },
  logoImage: { type: String, default: null },
  loading: { type: Boolean, default: false },
});
const { t } = useI18n();
const websiteStore = useWebsiteStore();
const collectionStore = useCollectionStore();

const data = computed(() => {
  return [
    {
      label: t('nft.collection.name'),
      value: collectionStore.active.name,
    },
    {
      label: t('nft.collection.contractAddress'),
      value: collectionStore.active.contractAddress,
      link: contractLink(collectionStore.active.contractAddress, collectionStore.active.chain),
    },
    {
      label: t('nft.collection.uuid'),
      value: collectionStore.active.collection_uuid,
      copy: true,
    },
    {
      label: t('nft.collection.baseUri'),
      value: collectionStore.active.baseUri,
      component: resolveComponent('TableLink'),
      data: {
        link: props.baseUriLink || collectionStore.active.baseUri,
        text: collectionStore.active.baseUri,
      },
    },
    {
      label: t('dashboard.nav.hosting'),
      value: '',
      component: resolveComponent('TableLink'),
      loading: collectionStore.loading || websiteStore.loading,
      show: !!collectionStore.active?.websiteUuid,
      data: {
        text: websiteStore.active.domain || websiteStore.active.name,
        link: websiteStore.active.website_uuid ? `/dashboard/service/hosting/${websiteStore.active.website_uuid}` : '',
      },
    },
  ];
});
</script>
