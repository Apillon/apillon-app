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
                <span class="icon-search text-2xl"></span>
              </template>
            </n-input>
          </div>

          <n-space size="large">
            <!-- Refresh files -->
            <n-button
              size="small"
              :loading="ipnsStore.loading"
              @click="ipnsStore.fetchIpns(bucketId)"
            >
              <span class="icon-refresh text-xl mr-2"></span>
              {{ $t('general.refresh') }}
            </n-button>

            <!-- Create new website -->
            <n-button v-if="ipnsStore.hasIpns" size="small" @click="modalCreateIpnsVisible = true">
              <span class="icon-create-folder text-xl text-primary mr-2"></span>
              <span class="text-primary">{{ $t('general.addNew') }}</span>
            </n-button>
          </n-space>
        </n-space>

        <!-- DataTable: IPNS -->
        <TableStorageIpns v-if="ipnsStore.hasIpns" />
        <Empty
          v-else
          :title="$t('general.nothingHere')"
          :info="$t('storage.ipns.createFirst')"
          icon="storage/empty"
        >
          <Btn type="primary" @click="modalCreateIpnsVisible = true">
            {{ $t('storage.ipns.new') }}
          </Btn>
        </Empty>
      </n-space>

      <!-- Modal - New IPNS -->
      <modal v-model:show="modalCreateIpnsVisible" :title="$t('storage.ipns.new')">
        <FormStorageIpns @submit-success="modalCreateIpnsVisible = false" />
      </modal>
    </slot>
  </Dashboard>
</template>

<script lang="ts" setup>
const $i18n = useI18n();
const ipnsStore = useIpnsStore();
const { pageLoading, initBucket } = useStorage();

const { params } = useRoute();
const bucketId = ref<number>(parseInt(`${params?.slug}`));
const modalCreateIpnsVisible = ref<boolean>(false);

useHead({
  title: $i18n.t('nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
