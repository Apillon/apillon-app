<template>
  <div class="flex h-full flex-col justify-between">
    <TableInfo :data="data" />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const bucketStore = useBucketStore();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
const collectionStore = useCollectionStore();

const { simplets, getSimpletType } = useSimplet();

const loadingImages = ref<boolean>(true);
const collection = ref<CollectionInterface | null>();
const logo = ref<BucketItemInterface | undefined>();

onMounted(async () => {
  collection.value = await collectionStore.getCollection(simpletStore.active.contract_uuid);

  if (collection.value) {
    collectionStore.active = collection.value;
    await bucketStore.fetchDirectoryContent({
      bucketUuid: collection.value.bucket_uuid,
      search: 'logo',
    });
    logo.value = bucketStore.folder.items.find(item => item.type === BucketItemType.FILE && item.name.includes('logo'));
  }

  await sleep(10);
  loadingImages.value = false;
});

const adminWallet = computed(() => simpletStore.getBackendVariable('ADMIN_WALLET'));
const simpletType = computed(() => simpletStore.getBackendVariable('CLAIM_TYPE'));

const data = computed(() => {
  return [
    {
      label: t('form.label.simplet.name'),
      value: simpletStore.active.name,
    },
    {
      label: t('simplet.uuid'),
      value: simpletStore.active.simplet_uuid,
      copy: true,
    },
    {
      label: t('general.type'),
      value: simpletType.value
        ? t(`simplet.${simplets[simpletType.value]}.name`)
        : getSimpletType(simpletStore.active.simplet_uuid),
    },
    {
      label: t('nft.collection.preview'),
      value: collection.value?.name,
      img: logo.value?.link || '',
    },
    {
      label: t('form.label.simplet.walletAddress'),
      value: adminWallet.value || '',
      loading: deploymentStore.loading,
      copy: true,
    },
    {
      label: t('simplet.backendStatus'),
      value: simpletStore.active.backendStatus,
      component: resolveComponent('SimpletStatus'),
      data: {
        status: simpletStore.active.backendStatus,
      },
    },
    {
      label: t('simplet.endpoint'),
      component: resolveComponent('TableLink'),
      data: {
        link: simpletStore.active?.backendUrl,
      },
    },
    {
      label: t('simplet.frontendStatus'),
      value: simpletStore.active.frontendStatus,
      component: resolveComponent('SimpletStatus'),
      data: {
        status: simpletStore.active.frontendStatus,
      },
    },
    {
      label: t('general.website'),
      loading: websiteStore.loading,
      component: resolveComponent('TableLink'),
      data: {
        text: websiteStore.active.domain || websiteStore.active.name,
        link:
          websiteStore.active.domain ||
          websiteStore.active.w3ProductionLink ||
          `/dashboard/service/hosting/${websiteStore.active.website_uuid}`,
      },
    },
  ];
});
</script>
