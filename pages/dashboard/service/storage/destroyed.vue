<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('nav.storage') }}</h4>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <button class="align-sub" @click="showModalW3Warn = true">
              <span class="icon-info text-xl"></span>
            </button>
          </n-space>
        </template>

        <template #submenu>
          <MenuStorage />
        </template>
      </Heading>
    </template>
    <slot>
      <TableStorageBucket
        v-if="bucketStore.hasDestroyedBuckets"
        :buckets="bucketStore.destroyed"
        :deleted="true"
      />
      <template v-else>
        <div
          class="flex flex-col items-center justify-center px-6 py-4"
          style="min-height: calc(100vh - 250px)"
        >
          <div class="mb-4">
            <NuxtIcon name="storage/empty" class="icon-auto" filled />
          </div>
          <div class="mb-10 text-center">
            <h3 class="font-bold">{{ $t('general.nothingHere') }}</h3>
            <p class="text-body">{{ $t('storage.bucket.destroyedBuckets') }}</p>
          </div>
        </div>
      </template>

      <!-- W3Warn: destroyed buckets -->
      <W3Warn v-model:show="showModalW3Warn">
        {{ $t('w3Warn.bucket.delete') }}
      </W3Warn>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const dataStore = useDataStore();
const bucketStore = useBucketStore();
const pageLoading = ref<boolean>(true);
const showModalW3Warn = ref<boolean>(false);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  Promise.all(Object.values(dataStore.promises)).then(async _ => {
    await bucketStore.getBuckets(true);

    pageLoading.value = false;
  });
});
</script>
