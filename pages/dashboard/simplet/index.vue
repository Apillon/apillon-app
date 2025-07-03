<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplets />
    </template>
    <div class="pb-8">
      <div class="grid gap-4 lg:grid-cols-3">
        <Card
          v-for="(simplet, key) in simpletStore.templates"
          :key="key"
          :service="parseSimplet(simplet)"
          dark
          title-new-line
        >
          <div class="grid grid-cols-2 gap-2">
            <Btn class="w-full" type="secondary" :to="`/dashboard/simplet/${simplet.name}`">
              {{ $t('general.details') }}
            </Btn>
            <Btn class="w-full" @click="openModal(simplet)">{{ $t('auth.onboarding.getStarted') }}</Btn>
          </div>
        </Card>
      </div>
    </div>

    <SimpletModal
      v-model:show="simpletStore.modalCreateVisible"
      :type="simpletType"
      :title="$t('simplet.wizard.create')"
    />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const simpletStore = useSimpletStore();
const metadataStore = useMetadataStore();
const collectionStore = useCollectionStore();

const pageLoading = ref<boolean>(true);
const simpletType = ref<SimpletTemplateInterface>();

useHead({
  title: t('dashboard.nav.simplets'),
});

onBeforeMount(() => {
  metadataStore.stepMetadata = NftMetadataStep.CHAIN;
  metadataStore.stepCollectionCreate = CollectionCreateStep.METADATA;
});

onMounted(async () => {
  simpletStore.fetchSimplets();
  await simpletStore.fetchSimpletTemplates();
  pageLoading.value = false;
});

const parseSimplet = (simplet: SimpletTemplateInterface): ServiceTypeItem => ({
  id: simplet.id,
  key: simplet.name,
  name: t(`simplet.${simplet.name}.name`),
  description: `${simplet.description}`,
  icon: ``,
  iconSvg: `simplet/${simplet.name}`,
  usage: translateItems(`simplet.${simplet.name}.usage`),
});

function openModal(type: SimpletTemplateInterface) {
  simpletStore.resetForm();
  simpletType.value = type;
  simpletStore.stepSimpletCreate = SimpletCreateStep.COLLECTION;
  simpletStore.modalCreateVisible = true;
  collectionStore.active = {} as CollectionInterface;
}
</script>
