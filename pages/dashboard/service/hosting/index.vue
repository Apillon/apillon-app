<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderHosting />
    </template>
    <slot>
      <n-space v-if="websiteStore.hasWebsites" class="pb-8" :size="32" vertical>
        <ActionsHosting />
        <TableHosting :websites="websiteStore.items" />
      </n-space>
      <Empty v-else :title="$t('hosting.web3Hosting')" :info="$t('hosting.web3HostingEnable')" icon="storage/empty">
        <div class="flex flex-col gap-4">
          <StorageGithubProjectConfig class="locked" size="small" />
          <Btn type="primary" @click="createNewWebsite">
            {{ $t('hosting.website.addFirst') }}
          </Btn>
        </div>
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
const $i18n = useI18n();
const dataStore = useDataStore();
const storageStore = useStorageStore();
const websiteStore = useWebsiteStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_NEW);

const pageLoading = ref<boolean>(true);
const showModalNewWebsite = ref<boolean | null>(false);

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await storageStore.getStorageInfo();
      await websiteStore.getWebsites();

      pageLoading.value = false;
    });
  }, 100);
});

/**
 * On createNewWebsite click
 * If W3Warn has already been shown, show modal create new website, otherwise show warn first
 * */
function createNewWebsite() {
  if (localStorage.getItem(LsW3WarnKeys.HOSTING_NEW) || !$i18n.te('w3Warn.hosting.upload')) {
    showModalNewWebsite.value = true;
  } else {
    modalW3WarnVisible.value = true;
    showModalNewWebsite.value = null;
  }
}

/** When user close W3Warn, allow him to create new website */
function onModalW3WarnHide() {
  if (showModalNewWebsite.value !== false) {
    showModalNewWebsite.value = true;
  }
}
</script>
