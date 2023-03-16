<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <Heading>
        <slot>
          <h4>{{ $t('nav.storage') }}</h4>
        </slot>

        <template #info>
          <n-space :size="32" align="center">
            <IconInfo @click="showModalW3Warn = true" />
            <n-button
              class="align-sub px-2"
              size="small"
              type="tertiary"
              quaternary
              round
              @click="showModalW3Warn = true"
            >
              <span class="icon-info text-2xl"></span>
            </n-button>
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
      <Empty
        v-else
        :title="$t('general.nothingHere')"
        :info="$t('storage.bucket.destroyedBuckets')"
        icon="storage/empty"
      />

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
