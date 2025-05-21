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

const adminWallet = computed(() => deploymentStore.variables.find(v => v.key === 'ADMIN_WALLET'));
const simpletType = computed(() => deploymentStore.variables.find(v => v.key.includes('CLAIM_TYPE')));

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
      label: t('general.status'),
      value: simpletStore.active.frontendStatus,
      component: resolveComponent('SimpletStatus'),
      data: {
        status: simpletStore.active.frontendStatus,
      },
    },
    {
      label: t('form.label.simplet.walletAddress'),
      value: adminWallet.value?.value || '',
      loading: deploymentStore.loading,
      copy: true,
    },
    {
      label: t('general.type'),
      value: simpletType.value
        ? t(`simplet.${simplets[simpletType.value.value]}.name`)
        : getSimpletType(simpletStore.active.simplet_uuid),
    },
    {
      label: t('nft.collection.preview'),
      value: collection.value?.name,
      img: logo.value?.link || '',
    },
    {
      label: t('general.website'),
      value: websiteStore.active.domain || websiteStore.active.w3ProductionLink || '',
      loading: websiteStore.loading,
      tag: t('dashboard.nav.hosting'),
      copy: true,
    },
    {
      label: t('simplet.endpoint'),
      value: simpletStore.active?.backendUrl || '',
      copy: true,
    },
  ];
});
</script>
