<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('nav.hosting') }}</h4>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <Btn
              v-if="dataStore.hasWebpages"
              type="primary"
              size="small"
              @click="showModalNewWebpage = true"
            >
              {{ $t('hosting.webpage.new') }}
            </Btn>
          </n-space>
        </template>
      </Heading>
    </template>
    <slot>
      <TableStorageWebpage
        v-if="dataStore.hasWebpages"
        :webpages="dataStore.webpage.items"
        @refresh="fetchWebpages()"
      />
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
            <Btn type="primary" @click="showModalNewWebpage = true">
              {{ $t('hosting.webpage.addFirst') }}
            </Btn>
          </div>
        </div>
      </template>

      <!-- Modal - Create Webpage -->
      <modal v-model:show="showModalNewWebpage" :title="$t('hosting.webpage.new')">
        <FormHostingWebpage @submit-success="showModalNewWebpage = false" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const $i18n = useI18n();
const message = useMessage();
const dataStore = useDataStore();
const pageLoading = ref<boolean>(true);
const showModalNewWebpage = ref<boolean | null>(false);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await getWebpages();
    await getWebpageQuota();

    pageLoading.value = false;
  });
});

async function getWebpages() {
  if (!dataStore.hasWebpages || isCacheExpired(LsCacheKeys.WEBPAGES)) {
    await fetchWebpages();
  }
}

/**
 * API cals
 * */
/** GET Webpages */
async function fetchWebpages() {
  if (!dataStore.hasProjects) {
    await dataStore.fetchProjects();
  }
  dataStore.webpage.loading = true;

  try {
    const params: Record<string, string | number> = {
      project_uuid: dataStore.currentProject?.project_uuid || '',
    };

    const req = $api.get<WebpagesResponse>(endpoints.webpages(), params);
    dataStore.promises.webpages = req;
    const res = await req;

    dataStore.webpage.items = res.data.items;
    dataStore.webpage.search = '';

    /** Save timestamp to SS */
    sessionStorage.setItem(LsCacheKeys.WEBPAGES, Date.now().toString());
  } catch (error: any) {
    dataStore.webpage.items = [] as Array<WebpageInterface>;

    /** Show error message  */
    message.error(userFriendlyMsg(error));
  }
  dataStore.webpage.loading = false;
}

/** GET Bucket quota, if current value is null  */
async function getWebpageQuota() {
  if (dataStore.webpage.quotaReached === undefined) {
    await dataStore.fetchBucketQuota(BucketType.HOSTING);
  }
}
</script>
