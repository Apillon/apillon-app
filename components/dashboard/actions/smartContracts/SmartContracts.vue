<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-if="archive" v-model:value="deployedContractStore.archive.search" />
      <FormFieldSearch v-else v-model:value="deployedContractStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh -->
      <n-button
        size="medium"
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
      <Btn
        inner-class="flex gap-2 items-center"
        type="primary"
        :disabled="authStore.isAdmin()"
        @click="router.push({ name: 'dashboard-service-smart-contracts-new' })"
      >
        <span class="icon-add text-xl"></span>
        <span>{{ $t('smartContracts.new') }}</span>
      </Btn>
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
