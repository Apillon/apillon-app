<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderCloudFunctions />
    </template>
    <slot>
      <n-space v-if="cloudFunctionStore.hasCloudFunctions" class="pb-8" :size="32" vertical>
        <ActionsCloudFunctions archive />
        <TableCloudFunctions :functions="cloudFunctionStore.archive" archive />
      </n-space>
      <Empty
        v-else
        :title="$t('computing.cloudFunctions.emptyArchive')"
        :info="$t('computing.cloudFunctions.emptyArchiveInfo')"
        icon="storage/empty"
      >
        <Btn type="primary" :to="{ name: 'dashboard-service-cloud-functions' }">
          {{ $t('dashboard.nav.cloudFunctions') }}
        </Btn>
      </Empty>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const cloudFunctionStore = useCloudFunctionStore();

const pageLoading = ref<boolean>(true);

useHead({
  title: t('dashboard.nav.cloudFunctions'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await cloudFunctionStore.getCloudFunctions();

  pageLoading.value = false;
});
</script>
