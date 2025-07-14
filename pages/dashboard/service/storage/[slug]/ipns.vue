<template>
  <Dashboard :loading="pageLoading">
    <template #heading>
      <HeaderStorageBucket />
    </template>

    <slot>
      <n-space class="pb-8" :size="12" vertical>
        <!-- Actions -->
        <n-space justify="space-between">
          <div class="w-[45vw] max-w-xs sm:w-[30vw] lg:w-[20vw]">
            <FormFieldSearch v-model:value="ipnsStore.search" />
          </div>

          <n-space size="large">
            <ModalCreditCosts :service="ServiceTypeName.STORAGE" />
            <!-- Refresh files -->
            <n-button :loading="ipnsStore.loading" @click="ipnsStore.fetchIpns(bucketUuid)">
              <span class="icon-refresh mr-2 text-xl"></span>
              {{ $t('general.refresh') }}
            </n-button>

            <!-- Create new website -->
            <n-button v-if="ipnsStore.hasIpns" @click="modalCreateIpnsVisible = true">
              <span class="icon-create-folder mr-2 text-xl text-primary"></span>
              <span class="text-primary">{{ $t('general.addNew') }}</span>
            </n-button>
          </n-space>
        </n-space>

        <!-- DataTable: IPNS -->
        <TableStorageIpns v-if="ipnsStore.hasIpns" />
        <Empty v-else :title="$t('general.nothingHere')" :info="$t('storage.ipns.createFirst')" icon="storage/empty">
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
import { ServiceTypeName } from '~/lib/types/service';

const { t } = useI18n();
const ipnsStore = useIpnsStore();
const { pageLoading, initBucket } = useStorage();

const { params } = useRoute();
const bucketUuid = ref<string>(`${params?.slug}`);
const modalCreateIpnsVisible = ref<boolean>(false);

useHead({
  title: t('dashboard.nav.storage'),
});

onMounted(() => {
  initBucket();
});
</script>
