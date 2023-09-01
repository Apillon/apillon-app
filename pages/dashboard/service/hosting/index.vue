<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h1>{{ $t('dashboard.nav.hosting') }}</h1>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo v-if="$i18n.te('w3Warn.hosting.upload')" @click="modalW3WarnVisible = true" />
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <TableHosting v-if="websiteStore.hasWebsites" :websites="websiteStore.items" />
      <Empty
        v-else
        :title="$t('hosting.web3Hosting')"
        :info="$t('hosting.web3HostingEnable')"
        icon="storage/empty"
      >
        <Btn type="primary" @click="createNewWebsite">
          {{ $t('hosting.website.addFirst') }}
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
const $i18n = useI18n();
const dataStore = useDataStore();
const websiteStore = useWebsiteStore();
const { modalW3WarnVisible } = useW3Warn(LsW3WarnKeys.HOSTING_DEPLOY);

const pageLoading = ref<boolean>(true);
const showModalNewWebsite = ref<boolean | null>(false);

useHead({
  title: $i18n.t('dashboard.nav.hosting'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await websiteStore.getWebsites();
      getWebsiteQuota();

      pageLoading.value = false;
    });
  }, 100);
});

/** GET Website quota, if current value is null  */
async function getWebsiteQuota() {
  if (websiteStore.quotaReached === undefined) {
    await websiteStore.fetchWebsiteQuota();
  }
}

/**
 * On createNewWebsite click
 * If W3Warn has already been shown, show modal create new website, otherwise show warn first
 * */
function createNewWebsite() {
  if (sessionStorage.getItem(LsW3WarnKeys.HOSTING_NEW) || !$i18n.te('w3Warn.hosting.upload')) {
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
