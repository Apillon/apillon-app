<template>
  <Dashboard :loading="pageLoading" :learn-collapsible="false">
    <template #heading>
      <div class="flex max-w-3xl flex-col gap-4">
        <div class="flex flex-col gap-6">
          <div class="flex flex-row items-center gap-4">
            <NuxtLink
              :to="{
                path: `/dashboard/service/storage/${bucketStore.active.bucket_uuid}`,
              }"
            >
              <span class="icon-back align-sub text-2xl"></span>
            </NuxtLink>
            <h2>{{ $t('storage.ipns.create-title') }}</h2>
          </div>
          <p>{{ $t('storage.ipns.subtitle') }}</p>
        </div>
        <p>{{ $t('storage.ipns.create-description') }}</p>
        <p style="white-space: pre-wrap">{{ $t('storage.ipns.how-to') }}</p>
        <p>{{ $t('storage.ipns.learn-more') }}</p>
        <FormStorageIpnsAdd :buckets="bucketStore.items" />
      </div>
    </template>
  </Dashboard>
</template>
<script lang="ts" setup>
const { t } = useI18n();
const pageLoading = ref<boolean>(false);

const dataStore = useDataStore();
const bucketStore = useBucketStore();

useHead({
  title: t('storage.ipfs.title'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await bucketStore.getBuckets();

    pageLoading.value = false;
  });
});
</script>
