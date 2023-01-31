<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('nav.hosting') }}</h4>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <button class="align-sub" @click="showModalW3Warn = true">
              <span class="icon-info text-xl"></span>
            </button>
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <TableHosting v-if="dataStore.hasWebpages" :webpages="dataStore.webpage.items" />
      <template v-else>
        <div
          class="flex flex-col items-center justify-center px-6 py-4"
          style="min-height: calc(100vh - 270px)"
        >
          <div class="mb-4">
            <NuxtIcon name="storage/empty" class="icon-auto" filled />
          </div>
          <div class="mb-10 text-center">
            <h3 class="font-bold">{{ $t('hosting.web3Hosting') }}</h3>
            <p class="text-body">{{ $t('hosting.web3HostingEnable') }}</p>
          </div>
          <div>
            <Btn type="primary" @click="createNewWebpage">
              {{ $t('hosting.webpage.addFirst') }}
            </Btn>
          </div>
        </div>
      </template>

      <W3Warn v-model:show="showModalW3Warn" @update:show="onModalW3WarnHide">
        {{ $t('w3Warn.hosting.new') }}
      </W3Warn>

      <!-- Modal - Create Webpage -->
      <modal v-model:show="showModalNewWebpage" :title="$t('hosting.webpage.new')">
        <FormHostingWebpage />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);
const showModalNewWebpage = ref<boolean | null>(false);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      await dataStore.getWebpages();
      await getWebpageQuota();

      pageLoading.value = false;
    });
  }, 100);
});

/** GET Webpage quota, if current value is null  */
async function getWebpageQuota() {
  if (dataStore.webpage.quotaReached === undefined) {
    await dataStore.fetchWebpageQuota();
  }
}

/**
 * On createNewWebpage click
 * If W3Warn has already been shown, show modal create new webpage, otherwise show warn first
 * */
function createNewWebpage() {
  if (sessionStorage.getItem(LsW3WarnKeys.HOSTING_NEW) || !$i18n.te('w3Warn.hosting.new')) {
    showModalNewWebpage.value = true;
  } else {
    showModalW3Warn.value = true;
    showModalNewWebpage.value = null;
  }
}

/** When user close W3Warn, allow him to create new webpage */
function onModalW3WarnHide(value: boolean) {
  if (!value && showModalNewWebpage.value !== false) {
    showModalNewWebpage.value = true;
  }
}

/** Watch showModalNewWebpage, onShow update timestamp of shown modal in session storage */
watch(
  () => showModalW3Warn.value,
  shown => {
    if (shown) {
      sessionStorage.setItem(LsW3WarnKeys.HOSTING_NEW, Date.now().toString());
    }
  }
);
</script>
