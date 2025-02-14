<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <n-input
        v-if="archive"
        v-model:value="deployedContractStore.archive.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
      <n-input
        v-else
        v-model:value="deployedContractStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-2xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Refresh -->
      <n-button
        size="small"
        :loading="archive ? deployedContractStore.archive.loading : deployedContractStore.loading"
        @click="
          archive
            ? deployedContractStore.fetchDeployedContractsArchive(
                deployedContractStore.archive.pagination.page,
                deployedContractStore.archive.pagination.pageSize
              )
            : deployedContractStore.fetchDeployedContracts(
                deployedContractStore.pagination.page,
                deployedContractStore.pagination.pageSize
              )
        "
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <n-button
        size="small"
        :disabled="authStore.isAdmin()"
        @click="router.push({ name: 'dashboard-service-smart-contracts-new' })"
      >
        <span class="icon-file mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('smartContracts.new') }}</span>
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});
const router = useRouter();
const authStore = useAuthStore();
const deployedContractStore = useDeployedContractStore();
</script>
