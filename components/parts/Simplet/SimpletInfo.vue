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

const { getSimpletType } = useSimplet();

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
      value: adminWallet.value?.value,
      loading: deploymentStore.loading,
      copy: true,
    },
    {
      label: t('general.type'),
      value: getSimpletType(simpletStore.active.simplet_uuid),
    },
    {
      label: t('nft.collection.preview'),
      value: collection.value?.name,
      img:
        logo.value?.link ||
        'http://bafybeif2tcwzfvpxki423cnrplpyjvyns66iiof7v6jit4q6dt2uqe6wya.ipfs.eu1.web3approved.com/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJiYWZ5YmVpZjJ0Y3d6ZnZweGtpNDIzY25ycGxweWp2eW5zNjZpaW9mN3Y2aml0NHE2ZHQydXFlNnd5YSIsInByb2plY3RfdXVpZCI6ImY2N2RkOTlhLTY5ZDEtNGY2Zi05Y2QzLWYwYWMyZDdmYWRjNCIsImlhdCI6MTc0NjYxNzAwNywic3ViIjoiSVBGUy10b2tlbiJ9.fkWNeUUTGmfdOKDNawwNuoDAeG8cd8q2iGJr8av3itY',
    },
    {
      label: t('general.website'),
      value: websiteStore.active.domain || websiteStore.active.w3ProductionLink,
      loading: websiteStore.loading,
      tag: t('dashboard.nav.hosting'),
      copy: true,
    },
    {
      label: t('simplet.endpoint'),
      value: simpletStore.active.backendUrl,
      copy: true,
    },
  ];
});
</script>
