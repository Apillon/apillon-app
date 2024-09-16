<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
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
      <!-- Create new collection -->
      <n-button
        size="small"
        :disabled="authStore.isAdmin()"
        @click="router.push({ name: 'dashboard-service-smart-contracts-new' })"
      >
        <span class="icon-file text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('dashboard.service.smartContracts.new') }}</span>
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const router = useRouter();
const authStore = useAuthStore();
const deployedContractStore = useDeployedContractStore();
</script>
