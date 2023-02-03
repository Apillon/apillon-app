<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HostingHeading />
    </template>
    <slot>
      <template
        v-if="
          dataStore.folder.items.length ||
          dataStore.bucket.active.CID ||
          dataStore.webpage.deployment.production.length > 0
        "
      >
        <n-space class="pb-8" :size="32" vertical>
          <HostingWebsiteActions />

          <!-- Domain preview -->
          <div>
            <div class="body-sm mb-2">
              <strong>{{ $t('hosting.domain.preview') }}</strong>
            </div>
            <n-space class="w-full" :wrap="!isLg">
              <a :href="`https://${dataStore.webpage.active.domain}`" target="_blank">
                <div class="flex justify-between items-center bg-bg-dark px-4 py-2">
                  <n-ellipsis class="align-bottom" :line-clamp="1">
                    {{ dataStore.webpage.active.domain }}
                  </n-ellipsis>
                  <span class="icon-preview text-xl align-middle ml-2"></span>
                </div>
              </a>
              <Btn
                v-if="dataStore.webpage.active.domain"
                type="primary"
                size="small"
                @click="showModalDomain = true"
              >
                {{ $t('hosting.domain.setup') }}
              </Btn>
              <Btn v-else type="primary" size="small" @click="showModalDomain = true">
                {{ $t('hosting.domain.add') }}
              </Btn>
              <Btn type="secondary" size="small" @click="showModalConfiguration = true">
                {{ $t('hosting.domain.configure') }}
              </Btn>
            </n-space>
          </div>

          <!-- IPNS link -->
          <PreviewLink :link="dataStore.webpage.active.ipnsProductionLink || ''" />

          <!-- Deployments -->
          <TableHostingDeployment :deployments="dataStore.webpage.deployment.production" />

          <!-- Breadcrumbs -->
          <div>
            <div class="relative h-8">
              <StorageBreadcrumbs v-if="dataStore.folder.selected" class="absolute" />
            </div>
            <TableStorageFiles :actions="false" />
          </div>
        </n-space>
      </template>
      <template v-else>
        <div
          class="flex flex-col items-center justify-center px-6 py-4"
          style="min-height: calc(100vh - 270px)"
        >
          <div class="mb-4">
            <NuxtIcon name="storage/empty" class="icon-auto" filled />
          </div>
          <div class="mb-10 text-center">
            <h3 class="font-bold">{{ $t('general.nothingHere') }}</h3>
            <p class="text-body">{{ $t('hosting.productionEmpty') }}</p>
          </div>
        </div>
      </template>
    </slot>
  </Dashboard>

  <!-- Modal - Webpage domain -->
  <modal v-model:show="showModalDomain" :title="$t('hosting.domain.new')">
    <FormHostingDomain :webpage-id="webpageId" />
  </modal>

  <!-- Modal - Webpage domain -->
  <modal
    v-model:show="showModalConfiguration"
    class="!w-auto"
    title="How to setup a domain for Apillon hosting?"
  >
    <div>
      <ol>
        <li>1. Open your DNS editor</li>
        <li>2. Change A record or add a new A record with the following IP: 52.19.92.40</li>
        <li>
          3. Open Hosting service in Apillon Dashboard, move to the Production tab and copy the
          provided URL
        </li>
        <li>4. Back in the DNS editor add a new TXT record with the following inputs:</li>
      </ol>
      <br />

      <h4>TXT Record:</h4>
      <p>
        <strong>Hostname: </strong>
        <template v-if="dataStore.webpage.active.domain">
          <span> _dnslink.{{ dataStore.webpage.active.domain }} </span>
          <button
            class="ml-2"
            @click="copyToClipboard(`_dnslink.${dataStore.webpage.active.domain}`)"
          >
            <span class="icon-copy"></span>
          </button>
        </template>
        <span v-else>_dnslink.yourdomain.com</span>
      </p>
      <p v-if="dataStore.bucket.active.IPNS" class="lg:whitespace-nowrap">
        <strong>Value: </strong>
        <span>dnslink=/ipns/{{ dataStore.bucket.active.IPNS }}</span>
        <button
          class="ml-2"
          @click="copyToClipboard(`dnslink=/ipns/${dataStore.bucket.active.IPNS}`)"
        >
          <span class="icon-copy"></span>
        </button>
      </p>
      <p v-else class="lg:whitespace-nowrap">
        <strong>Value: </strong>
        <span>dnslink=/ipns/yourIPNS</span>
      </p>
      <br />

      <h4>TXT Record Example:</h4>
      <p>
        <strong>Hostname: </strong>
        <span>dnslink.google.com</span>
      </p>
      <p class="lg:whitespace-nowrap">
        <strong>Value: </strong>
        <span>dnslink=/ipns/k2k4r8jr49vcd16dqpge14mkaghgvm04bscv9zp8nhodzrwx5uw519u0</span>
      </p>
    </div>
  </modal>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const router = useRouter();
const { params } = useRoute();
const { isLg } = useScreen();
const dataStore = useDataStore();

const webpageId = ref<number>(parseInt(`${params?.slug}`));
const pageLoading = ref<boolean>(true);
const showModalDomain = ref<boolean>(false);
const showModalConfiguration = ref<boolean>(false);

useHead({
  title: $i18n.t('nav.hosting'),
});

onMounted(() => {
  /** Webpage ID from route, then load buckets */
  dataStore.setWebpageId(webpageId.value);

  setTimeout(() => {
    Promise.all(Object.values(dataStore.promises)).then(async _ => {
      const webpage = await dataStore.getWebpage(webpageId.value);

      /** Check of webpage exists */
      if (!webpage?.id) {
        router.push({ name: 'dashboard-service-hosting' });
        return;
      }

      /** Get deployments for this webpage */
      dataStore.getDeployments(webpageId.value);

      /** Show files from staging bucket */
      dataStore.bucket.active = webpage.productionBucket;
      dataStore.setBucketId(webpage.productionBucket_id);

      dataStore.fetchDirectoryContent(webpage.productionBucket.bucket_uuid);

      if (webpage.bucket.uploadedSize === 0) {
        dataStore.bucket.uploadActive = true;
      }
      pageLoading.value = false;
    });
  }, 100);
});
</script>
