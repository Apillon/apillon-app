<template>
  <div class="flex h-full flex-col justify-between">
    <TableInfo :data="data" :max-lines="4" />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();
const collectionStore = useCollectionStore();
const { simplets } = useSimplet();

const loadingImages = ref<boolean>(true);

onMounted(async () => {
  collectionStore.active =
    (await collectionStore.getCollection(simpletStore.active.contract_uuid)) || collectionStore.active;
  loadingImages.value = false;
});

const adminWallet = computed(() => simpletStore.getBackendVariable('ADMIN_WALLET'));
const simpletType = computed(() => simpletStore.getBackendVariable('CLAIM_TYPE'));

const getSimpletName = (simplet_uuid: string) => {
  const simpletName =
    simpletStore.templates.find(item => item.simplet_uuid === simplet_uuid)?.name || SimpletName.AIRDROP;
  return t(`simplet.${simpletName}.name`);
};

const data = computed(() => {
  return [
    {
      label: t('general.type'),
      value: simpletType.value
        ? t(`simplet.${simplets[simpletType.value]}.name`)
        : getSimpletName(simpletStore.active.simplet_uuid),
      loading: simpletStore.loadingBackend,
    },
    {
      label: t('form.label.simplet.name'),
      value: simpletStore.active.name,
      loading: simpletStore.loading,
    },
    {
      label: t('simplet.url'),
      value: websiteStore.active.domain || websiteStore.active.w3ProductionLink,
      component: resolveComponent('TableLink'),
      loading:
        simpletStore.loading ||
        websiteStore.loading ||
        Number(simpletStore.active.frontendStatus) < ResourceStatus.ONLINE,
      show: !!(websiteStore.active.domain || websiteStore.active.w3ProductionLink),
      data: {
        link: websiteStore.active.domain || websiteStore.active.w3ProductionLink || 'Deployment in progress...',
      },
    },
    {
      label: t('simplet.backendStatus'),
      value: simpletStore.active.backendStatus,
      component: resolveComponent('SimpletStatus'),
      loading: simpletStore.loading,
      data: {
        status: simpletStore.active.backendStatus,
      },
    },
    {
      label: t('simplet.frontendStatus'),
      value: simpletStore.active.frontendStatus,
      component: resolveComponent('SimpletStatus'),
      loading: simpletStore.loading,
      data: {
        status: simpletStore.active.frontendStatus,
      },
    },
    // {
    //   label: t('simplet.uuid'),
    //   value: simpletStore.active.simpletDeploy_uuid,
    //   copy: true,
    //   loading: simpletStore.loading,
    // },
    {
      label: t('nft.collection.preview'),
      value: collectionStore.active?.name,
      component: resolveComponent('TableLink'),
      loading: collectionStore.loading,
      show: !!collectionStore.active?.name,
      data: {
        text: collectionStore.active?.name,
        link: `/dashboard/service/nft/${simpletStore.active.contract_uuid}`,
      },
    },
    {
      label: t('form.label.collection.adminAddress'),
      value: adminWallet.value || '',
      loading: simpletStore.loadingBackend,
      copy: true,
    },
    {
      label: t('simplet.endpoint'),
      value: simpletStore.active?.backendUrl || '',
      component: resolveComponent('TableLink'),
      loading: simpletStore.loading,
      data: {
        link: simpletStore.active?.backendUrl,
      },
    },
    {
      label: t('dashboard.nav.hosting'),
      value: '',
      component: resolveComponent('TableLink'),
      loading: simpletStore.loading || websiteStore.loading,
      show: !!websiteStore.active?.website_uuid,
      data: {
        text: websiteStore.active.domain || websiteStore.active.name,
        link: websiteStore.active.website_uuid ? `/dashboard/service/hosting/${websiteStore.active.website_uuid}` : '',
      },
    },
  ];
});
</script>
