<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-model:value="assetHubStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh assets -->
      <n-button size="small" :loading="assetHubStore.loading" @click="assetHubStore.fetchAssets()">
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new asset -->
      <n-button
        size="small"
        :disabled="authStore.isAdmin()"
        @click="$router.push({ name: 'dashboard-service-asset-hub-new' })"
      >
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('assetHub.new') }}</span>
      </n-button>

      <!-- View Documentation -->
      <BtnDocumentation size="small" href="https://wiki.polkadot.network/docs/learn-assets" />
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const authStore = useAuthStore();
const assetHubStore = useAssetHubStore();
</script>
