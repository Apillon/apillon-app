<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderHosting />
    </template>
    <slot>
      <n-space v-if="websiteStore.hasWebsiteArchive" class="pb-8" :size="32" vertical>
        <ActionsHosting v-if="websiteStore.hasWebsiteArchive" archive />
        <TableHosting :websites="websiteStore.archive" archive />
      </n-space>
      <Empty
        v-else
        :title="$t('hosting.web3HostingArchive')"
        :info="$t('hosting.web3HostingArchiveInfo')"
        icon="storage/empty"
      >
        <Btn type="primary" :to="{ name: 'dashboard-service-hosting' }">
          {{ $t('hosting.menu.website') }}
        </Btn>
      </Empty>

      <W3Warn v-model:show="modalW3WarnVisible" @submit="onModalW3WarnHide">
        {{ $t('w3Warn.hosting.upload') }}
      </W3Warn>

      <!-- Modal - Create Website -->
      <modal v-model:show="showModalNewWebsite" :title="$t('hosting.website.new')">
        <FormHostingWebsite />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_NEW);

const pageLoading = ref<boolean>(true);
const showModalNewWebsite = ref<boolean | null>(false);

useHead({
  title: t('dashboard.nav.hosting'),
});

onMounted(async () => {
  await dataStore.waitOnPromises();
  await storageStore.getStorageInfo();
  await websiteStore.getWebsiteArchive();

  pageLoading.value = false;
});

/** When user close W3Warn, allow him to create new website */
function onModalW3WarnHide() {
  if (showModalNewWebsite.value !== false) {
    showModalNewWebsite.value = true;
  }
}
</script>
