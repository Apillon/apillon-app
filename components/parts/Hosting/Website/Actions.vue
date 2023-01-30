<template>
  <n-space justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="dataStore.webpage.search"
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
      <n-button
        size="small"
        :loading="dataStore.folder.loading"
        @click="dataStore.fetchDirectoryContent()"
      >
        <span class="icon-refresh text-lg mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Deploy to production -->
      <n-button
        v-if="env === DeploymentEnvironment.STAGING"
        size="small"
        type="primary"
        :loading="deploying"
        @click="deploy"
      >
        <span class="icon-upload text-lg mr-2"></span>
        {{ $t('hosting.deployProd') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const props = defineProps({
  webpageItems: { type: Array<BucketItemInterface>, default: [] },
  env: { type: Number, default: DeploymentEnvironment.STAGING },
});

const dataStore = useDataStore();
const deploying = ref<boolean>(false);

/** Deploy to stg/prod */
async function deploy() {
  deploying.value = true;

  await dataStore.deployWebpage(dataStore.webpage.active.id, props.env);
  deploying.value = false;
}
</script>
