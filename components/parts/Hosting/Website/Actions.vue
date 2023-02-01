<template>
  <n-space justify="space-between">
    <div class="w-[20vw] max-w-xs">
      <n-input
        v-model:value="dataStore.folder.search"
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
      <n-button size="small" :loading="dataStore.folder.loading" @click="refresh">
        <span class="icon-refresh text-lg mr-2"></span>
        {{ $t('general.refresh') }}
      </n-button>

      <!-- Deploy to production -->
      <n-button
        v-if="env === DeploymentEnvironment.STAGING"
        size="small"
        type="primary"
        :loading="deploying"
        @click="deployToProduction"
      >
        <span class="icon-deploy text-lg mr-2"></span>
        {{ $t('hosting.deployProd') }}
      </n-button>
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
const props = defineProps({
  webpageItems: { type: Array<BucketItemInterface>, default: [] },
  env: { type: Number, default: DeploymentEnvironment.PRODUCTION },
});

const dataStore = useDataStore();
const deploying = ref<boolean>(false);

/** Refresh deyployment and hosting files */
function refresh() {
  dataStore.fetchDirectoryContent();
  dataStore.fetchDeployments(dataStore.webpage.active.id, props.env);
}

/** Deploy to prod */
async function deployToProduction() {
  deploying.value = true;

  await dataStore.deployWebpage(dataStore.webpage.active.id, DeploymentEnvironment.PRODUCTION);
  deploying.value = false;
}
</script>
