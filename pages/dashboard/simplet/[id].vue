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
const dataStore = useDataStore();
const simpletStore = useSimpletStore();
const { initWebsite } = useHosting();

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

  if (simpletStore.active.frontend_uuid) {
    initWebsite(-1, simpletStore.active.frontend_uuid);
  }

  try {
    const bodyParams = {
      project_uuid: dataStore.projectUuid,
      ...PARAMS_ALL_ITEMS,
    };
    const { data } = await $api.get(endpoints.simpletBackend(), bodyParams);
    console.log(data);

    if (simpletStore.active.backend_uuid) {
      const res = await $api.get(endpoints.simpletBackend(simpletStore.active.backend_uuid));
      console.log(res);
      const res2 = await $api.get(endpoints.simpletBackendDetails(simpletStore.active.backend_uuid));
      console.log(res2);
    }
  } catch (e: ApiError | any) {
    console.error(e);

    /** Show error message */
    window.$message.error(userFriendlyMsg(e));
  }
});
</script>
