<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderSimplet :back="{ name: 'dashboard-simplet-list' }" :name="simpletStore.active.name" />
    </template>

    <n-space class="pb-8" :size="32" vertical>
      <div class="flex gap-8">
        <div class="card-light flex-1 rounded-lg px-6 py-4">
          <SimpletInfo />
        </div>

        <div class="card max-w-64 px-6 py-4">
          <h6 class="mb-2">{{ $t('general.actions') }}</h6>
          <ActionsSimplet />
        </div>
      </div>
    </n-space>
  </Dashboard>
</template>

<script lang="ts" setup>
const router = useRouter();
const simpletStore = useSimpletStore();
const websiteStore = useWebsiteStore();

const { t } = useI18n();
const { params } = useRoute();
const { checkUnfinishedSimplet } = useSimplet();

const pageLoading = ref<boolean>(true);

/** Simplet UUID from route */
const simpletUuid = ref<string>(`${params?.id}`);

useHead({
  title: t('dashboard.nav.simplets'),
});

onMounted(async () => {
  if (!params?.id) router.push({ name: 'dashboard-simplet' });

  await simpletStore.getSimplet(simpletUuid.value);
  if (!simpletStore.active?.simplet_uuid) {
    router.push({ name: 'dashboard-simplet' });
  }
  pageLoading.value = false;

  loadSimpletData();
  checkUnfinishedSimplet(() => loadSimpletData());
});

watch(
  () => simpletStore.active.frontendStatus,
  (status, oldStatus) => {
    if (status === ResourceStatus.ONLINE && oldStatus === ResourceStatus.DEPLOYING) {
      loadSimpletData();
    }
  }
);

const loadSimpletData = async () => {
  if (simpletStore.active.frontend_uuid) {
    websiteStore.fetchWebsite(simpletStore.active.frontend_uuid);
  }

  if (simpletStore.active.backend_uuid) {
    simpletStore.fetchBackend(simpletStore.active.backend_uuid);
  }
};
</script>
