<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] min-w-[11rem] max-w-xs">
      <FormFieldSearch v-if="archive" v-model:value="simpletStore.archive.search" />
      <FormFieldSearch v-else v-model:value="simpletStore.search" />
    </div>

    <n-space size="large">
      <!-- Refresh collections -->
      <n-button
        size="medium"
        :loading="archive ? simpletStore.archive.loading : simpletStore.loading"
        @click="simpletStore.fetchSimplets(1, PAGINATION_LIMIT, archive)"
      >
        <span class="icon-refresh mr-2 text-xl"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new collection -->
      <n-button
        v-if="simpletStore.hasSimplets"
        size="medium"
        :disabled="authStore.isAdmin()"
        @click="modalCreateCollectionVisible = true"
      >
        <span class="icon-create-folder mr-2 text-xl text-primary"></span>
        <span class="text-primary">{{ $t('nft.collection.new') }}</span>
      </n-button>
    </n-space>
  </n-space>

  <ModalNft v-model:show="modalCreateCollectionVisible" />
</template>

<script lang="ts" setup>
defineProps({
  archive: { type: Boolean, default: false },
});

const authStore = useAuthStore();
const simpletStore = useSimpletStore();
const modalCreateCollectionVisible = ref<boolean>(false);
</script>
