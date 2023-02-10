<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="webpageStore.search"
        type="text"
        name="search"
        size="small"
        :placeholder="$t('general.search')"
        clearable
      >
        <template #prefix>
          <span class="icon-search text-xl"></span>
        </template>
      </n-input>
    </div>

    <n-space size="large">
      <!-- Refresh webpages -->
      <n-button size="small" :loading="webpageStore.loading" @click="webpageStore.fetchWebpages()">
        <span class="icon-refresh text-lg mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new webpage -->
      <n-button
        v-if="webpageStore.hasWebpages"
        type="primary"
        size="small"
        ghost
        @click="showModalEditWebpage = true"
      >
        <span class="icon-create-folder text-xl mr-2"></span>
        {{ $t('hosting.webpage.new') }}
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - New webpage -->
  <modal v-model:show="showModalEditWebpage" :title="$t('hosting.webpage.new')">
    <FormHostingWebpage />
  </modal>
</template>

<script lang="ts" setup>
const webpageStore = useWebpageStore();
const showModalEditWebpage = ref<boolean>(false);
</script>
