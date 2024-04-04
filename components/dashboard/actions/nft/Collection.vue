<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="min-w-[11rem] w-[20vw] max-w-xs">
      <n-input
        v-model:value="collectionStore.search"
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
      <!-- Refresh collections -->
      <n-button
        size="small"
        :loading="collectionStore.loading"
        @click="collectionStore.fetchCollections()"
      >
        <span class="icon-refresh text-xl mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <n-button
        v-if="collectionStore.hasCollections"
        size="small"
        :disabled="authStore.isAdmin()"
        @click="router.push({ name: 'dashboard-service-nft-new' })"
      >
        <span class="icon-create-folder text-xl text-primary mr-2"></span>
        <span class="text-primary">{{ $t('nft.collection.new') }}</span>
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const router = useRouter();
const authStore = useAuthStore();
const collectionStore = useCollectionStore();
</script>
