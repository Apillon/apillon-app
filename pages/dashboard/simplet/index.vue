<template>
  <Dashboard :loading="false">
    <template #heading>
      <HeaderSimplets />
    </template>
    <div class="pb-8">
      <p class="mb-2 max-w-lg">{{ $t('dashboard.simplet.templates') }}</p>

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
      v-model:show="showModalNewSimplet"
      :type="simpletType"
      :title="$t('dashboard.simplet.wizard.create')"
    />
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const simpletsStore = useSimpletsStore();
const { simpletsContent } = useSimplet();

const simpletType = ref<number>(SimpletType.AIRDROP);
const showModalNewSimplet = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.simplets'),
});

onMounted(() => {
  simpletsStore.fetchSimplets();
  simpletsStore.fetchSimpletTemplates();
});

function openModal(type: number) {
  simpletsStore.resetForm();
  simpletType.value = type;
  simpletsStore.stepSimpletCreate = SimpletCreateStep.COLLECTION;
  showModalNewSimplet.value = true;
}
</script>
