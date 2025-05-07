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
const { t } = useI18n();
const router = useRouter();
const { params } = useRoute();
const simpletStore = useSimpletStore();

const pageLoading = ref<boolean>(false);

/** Simplet UUID from route */
const simpletUuid = ref<string>(`${params?.id}`);

useHead({
  title: t('dashboard.nav.simplets'),
});

onMounted(async () => {
  if (!params?.id) router.push({ name: 'dashboard-service-nft' });

  const currentSimplet = await simpletStore.getSimplet(simpletUuid.value);
  if (!currentSimplet?.simplet_uuid) {
    router.push({ name: 'dashboard-simplet' });
  }
});
</script>
