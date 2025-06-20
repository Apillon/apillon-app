<template>
  <div class="flex h-full flex-col justify-between">
    <TableInfo :data="data.filter(i => i?.show !== false)" />
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();
const deploymentStore = useDeploymentStore();
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
      label: t('form.label.simplet.name'),
      value: simpletStore.active.name,
    },
    {
      label: t('simplet.uuid'),
      value: simpletStore.active.simpletDeploy_uuid,
      copy: true,
    },
    {
      label: t('general.type'),
      value: simpletType.value
        ? t(`simplet.${simplets[simpletType.value]}.name`)
        : getSimpletName(simpletStore.active.simplet_uuid),
    },
    {
      label: t('nft.collection.preview'),
      value: collectionStore.active?.name,
      component: resolveComponent('TableLink'),
      show: !!collectionStore.active?.name,
      data: {
        text: collectionStore.active?.name,
        link: `/dashboard/service/nft/${simpletStore.active.contract_uuid}`,
      },
    },
    {
      label: t('form.label.collection.adminAddress'),
      value: adminWallet.value || '',
      loading: deploymentStore.loading,
      copy: true,
    },
    {
      label: t('simplet.backendStatus'),
      value: simpletStore.backendStatus,
      component: resolveComponent('SimpletStatus'),
      data: {
        status: simpletStore.backendStatus,
      },
    },
    {
      label: t('simplet.endpoint'),
      value: simpletStore.active?.backendUrl || '',
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
      value: '',
      component: resolveComponent('TableLink'),
      show: !!websiteStore.active?.website_uuid,
      data: {
        text: websiteStore.active.domain || websiteStore.active.name,
        link: `/dashboard/service/hosting/${websiteStore.active.website_uuid}`,
      },
    },
    {
      label: t('simplet.url'),
      loading: websiteStore.loading,
      value: '',
      component: resolveComponent('TableLink'),
      show: !!(websiteStore.active.domain || websiteStore.active.w3ProductionLink),
      data: {
        link: websiteStore.active.domain || websiteStore.active.w3ProductionLink,
      },
    },
  ];
});
</script>
