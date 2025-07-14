<template>
  <div class="text-center">
    <div class="mx-auto mb-16 mt-8 max-w-lg">
      <IconSuccess class="text-3xl" />
      <h4 class="mt-6">{{ $t('nft.collection.deployed.title') }}</h4>
      <p>{{ $t('nft.collection.deployed.info') }}</p>
    </div>
    <div class="card-light border-none px-8 pb-14 pt-11">
      <h4>{{ $t('nft.collection.deployed.next') }}</h4>
      <p class="mb-9 mt-2">{{ $t('nft.collection.deployed.nextInfo') }}</p>

      <div class="mx-auto grid max-w-4xl gap-2 text-left md:grid-cols-2 md:gap-8">
        <Card
          v-for="(type, key) in deployTypes"
          :key="key"
          :service="type"
          class="cursor-pointer"
          dark
          title-new-line
          @click="openModal(type.id)"
        >
          <Btn class="w-full" @click="openModal(type.id)">{{ $t('form.deploy') }}</Btn>
        </Card>
      </div>

      <div class="mt-8 text-center text-sm text-white-primary">
        <Btn type="link" :to="`/dashboard/service/nft/${collectionStore.active.collection_uuid}`">
          {{ $t('nft.collection.deployed.skip') }}
        </Btn>
      </div>
    </div>

    <modal v-model:show="modalDeployWebsiteVisible" :title="$t('nft.collection.created.deploy')">
      <FormNftWebsiteDeploy @submit-success="onWebsiteDeployed" />
    </modal>

    <modal v-model:show="modalBuildWebsiteVisible" :title="$t('nft.collection.created.build')">
      <FormNftWebsiteBuild />
    </modal>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const router = useRouter();
const websiteStore = useWebsiteStore();
const collectionStore = useCollectionStore();

const modalDeployWebsiteVisible = ref<boolean>(false);
const modalBuildWebsiteVisible = ref<boolean>(false);

const deployTypes: ServiceTypeItem[] = ['autoDeploy', 'build'].map(type => {
  return {
    id: type,
    key: type,
    name: t(`nft.website.${type}.name`),
    description: t(`nft.website.${type}.description`),
    icon: '',
    iconSvg: type === 'build' ? `social/github` : 'icon/file',
    usage: translateItems(`nft.website.${type}.usage`),
  };
});

const openModal = (type: string | number) => {
  if (type === 'build') {
    modalBuildWebsiteVisible.value = true;
  } else {
    modalDeployWebsiteVisible.value = true;
  }
};

const onWebsiteDeployed = (website: WebsiteInterface) => {
  modalDeployWebsiteVisible.value = false;
  websiteStore.active = website;
  router.push(`/dashboard/service/hosting/${website.website_uuid}`);
};
</script>
