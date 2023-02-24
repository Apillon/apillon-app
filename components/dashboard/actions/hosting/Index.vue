<template>
  <n-space v-bind="$attrs" justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="websiteStore.search"
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
      <!-- Refresh websites -->
      <n-button size="small" :loading="websiteStore.loading" @click="websiteStore.fetchWebsites()">
        <span class="icon-refresh text-lg mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Create new website -->
      <n-button
        v-if="websiteStore.hasWebsites"
        type="primary"
        size="small"
        ghost
        @click="showModalEditWebsite = true"
      >
        <span class="icon-create-folder text-xl mr-2"></span>
        {{ $t('hosting.website.new') }}
      </n-button>
    </n-space>
  </n-space>

  <!-- Modal - New website -->
  <modal v-model:show="showModalEditWebsite" :title="$t('hosting.website.new')">
    <FormHostingWebsite />
  </modal>
</template>

<script lang="ts" setup>
const websiteStore = useWebsiteStore();
const showModalEditWebsite = ref<boolean>(false);
</script>
