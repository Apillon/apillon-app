<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <!-- Banner for hosting if project hasb't got any services -->
      <BannerStorage v-if="!dataStore.hasHosting" />

      <!-- Basic title -->
      <n-space v-else justify="space-between" align="center">
        <n-space size="large" align="center">
          <h4 class="mr-">{{ $t('nav.hosting') }}</h4>
          <div class="w-[1px] h-[13px] bg-grey"></div>
          <a href="#learn-more">{{ $t('general.learnMore') }}</a>
        </n-space>
        <nuxt-link
          v-show="!settingsStore.isProjectUser()"
          :to="{ name: 'dashboard-service-hosting-new' }"
        >
          <n-button type="primary">
            {{ $t('storage.hosting.new') }}
          </n-button>
        </nuxt-link>
      </n-space>
    </template>
    <slot>
      <TableBucket :bucket-type="BucketType.HOSTING" v-if="dataStore.hasHosting" />
      <template v-else>
        <h5 class="mb-8">{{ $t('nav.storage') }}</h5>
        <div
          class="flex flex-col md:flex-row items-center justify-between bg-grey-lightBg px-6 py-4"
        >
          <div class="mb-4 md:mb-0">
            <p class="body-md font-bold">{{ $t('storage.noActiveService') }}</p>
            <p class="body-sm">{{ $t('storage.attachService') }}</p>
          </div>
          <div>
            <nuxt-link :to="{ name: 'dashboard-service-hosting-new' }">
              <Btn type="primary">{{ $t('storage.hosting.addNew') }}</Btn>
            </nuxt-link>
          </div>
        </div>
      </template>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const settingsStore = useSettingsStore();
const pageLoading = ref<boolean>(true);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await getBuckets();

    pageLoading.value = false;
  });
});

async function getBuckets() {
  if (!dataStore.hasBuckets) {
    dataStore.promises.buckets = await dataStore.fetchBuckets();
  }
}
</script>
