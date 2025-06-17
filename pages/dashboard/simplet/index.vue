<template>
  <Dashboard :loading="false">
    <template #heading>
      <HeaderSimplets />
    </template>
    <div class="pb-8">
      <p class="mb-2 max-w-lg">{{ $t('simplet.templates') }}</p>

      <div class="grid gap-4 lg:grid-cols-3">
        <Card v-for="(simplet, key) in simpletsContent" :key="key" :service="simplet" dark title-new-line>
          <div class="grid grid-cols-2 gap-2">
            <Btn class="w-full" type="secondary" :to="`/dashboard/simplet/${simplet.key}`">
              {{ $t('general.details') }}
            </Btn>
            <Btn class="w-full" @click="openModal(Number(simplet.id))">{{ $t('auth.onboarding.getStarted') }}</Btn>
          </div>
        </Card>
      </div>
    </div>

    <!-- Modal - New Simplet -->
    <SimpletModal
      v-if="!collectionStore.modalCreateVisible"
      v-model:show="simpletStore.modalCreateVisible"
      :type="simpletType"
      :title="$t('simplet.wizard.create')"
    />
    <NftModal
      v-if="!simpletStore.modalCreateVisible"
      v-model:show="collectionStore.modalCreateVisible"
      simplet
      @on-created="onNftCollectionCreated"
    />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const { simpletsContent } = useSimplet();

const simpletStore = useSimpletStore();
const collectionStore = useCollectionStore();

const simpletType = ref<number>(SimpletType.AIRDROP);

useHead({
  title: t('dashboard.nav.simplets'),
});

onMounted(() => {
  simpletStore.fetchSimplets();
  simpletStore.fetchSimpletTemplates();
});

function openModal(type: number) {
  simpletStore.resetForm();
  simpletType.value = type;
  simpletStore.stepSimpletCreate = SimpletCreateStep.COLLECTION;
  simpletStore.modalCreateVisible = true;
}
function onNftCollectionCreated(collection: CollectionInterface) {
  collectionStore.modalCreateVisible = true;
  collectionStore.active = collection;

  setTimeout(() => (simpletStore.modalCreateVisible = true), 100);
  simpletStore.form.collection = collection;
}
</script>
