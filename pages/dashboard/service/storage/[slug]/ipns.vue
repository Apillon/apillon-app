<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderBucket />
    </template>

    <slot>
      <n-space class="pb-8" :size="12" vertical>
        <!-- Actions -->
        <n-space justify="space-between">
          <div class="w-[45vw] sm:w-[30vw] lg:w-[20vw] max-w-xs">
            <n-input
              v-model:value="ipnsStore.search"
              type="text"
              name="search"
              size="small"
              :placeholder="$t('storage.file.search')"
              clearable
            >
              <template #prefix>
                <span class="icon-search text-xl"></span>
              </template>
            </n-input>
          </div>

          <n-space size="large">
            <!-- Refresh files -->
            <n-button size="small" :loading="ipnsStore.loading" @click="ipnsStore.fetchIpns()">
              <span class="icon-refresh text-lg mr-2"></span>
              {{ $t('general.refresh') }}
            </n-button>
          </n-space>
        </n-space>

        <!-- DataTable: IPNS -->
        <TableStorageIpns />
      </n-space>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const ipnsStore = useIpnsStore();
const { pageLoading, initBucket } = useStorage();

const { params } = useRoute();
const bucketId = ref<number>(parseInt(`${params?.slug}`));

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
