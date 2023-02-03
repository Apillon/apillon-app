<template>
  <n-space class="pb-8" :size="32" vertical>
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
          ghost
          @click="deployToProduction"
        >
          <span class="icon-upload text-lg mr-2"></span>
          {{ $t('hosting.deployProd') }}
        </n-button>
      </n-space>
    </n-space>

    <!-- Domain preview -->
    <div>
      <div class="body-sm mb-2">
        <strong>{{ $t('hosting.domain.preview') }}</strong>
      </div>
      <div class="bg-bg-dark px-4 py-2">
        <a :href="dataStore.webpage.active.domain" target="_blank">
          {{ dataStore.webpage.active.domain }}
        </a>
      </div>
    </div>

    <n-data-table
      ref="tableRef"
      v-bind="$attrs"
      :bordered="false"
      :columns="columns"
      :data="data"
      :loading="dataStore.webpage.loading"
      :pagination="{ pageSize: PAGINATION_LIMIT }"
      :row-key="rowKey"
      :row-props="rowProps"
    />
  </n-space>
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';

const props = defineProps({
  webpageItems: { type: Array<BucketItemInterface>, default: [] },
  env: { type: Number, default: DeploymentEnvironment.PRODUCTION },
});

const $i18n = useI18n();
const dataStore = useDataStore();
const deploying = ref<boolean>(false);
const IconFolderFile = resolveComponent('IconFolderFile');

/** Data: filtered webpages */
const data = computed<Array<BucketItemInterface>>(() => {
  return (
    props.webpageItems.filter(item =>
      item.name.toLocaleLowerCase().includes(dataStore.webpage.search.toLocaleLowerCase())
    ) || []
  );
});

const createColumns = (): NDataTableColumns<BucketItemInterface> => {
  return [
    {
      key: 'name',
      title: $i18n.t('storage.fileName'),
      minWidth: 200,
      render(row) {
        return [h(IconFolderFile, { isFile: true }, ''), h('span', { class: 'ml-2 ' }, row.name)];
      },
    },
    {
      key: 'size',
      title: $i18n.t('storage.fileSize'),
      render(row: BucketItemInterface) {
        if (row.size) {
          return h('span', {}, { default: () => formatBytes(row.size || 0) });
        }
        return '';
      },
    },
    {
      title: $i18n.t('dashboard.created'),
      key: 'createTime',
      render(row: BucketItemInterface) {
        return h('span', {}, { default: () => datetimeToDate(row.createTime || '') });
      },
    },
    {
      title: $i18n.t('storage.contentType'),
      key: 'contentType',
      render(row: BucketItemInterface) {
        if (row.contentType) {
          return h('span', {}, row.contentType);
        }
        return '';
      },
    },
  ];
};
const columns = createColumns();
const rowKey = (row: BucketItemInterface) => row.id;
const currentRow = ref<BucketItemInterface>(props.webpageItems[0]);

/** On row click */
const rowProps = (row: BucketItemInterface) => {
  return {
    onClick: (e: Event) => {
      currentRow.value = row;
    },
  };
};

async function deployToProduction() {
  deploying.value = true;
  await dataStore.deployWebpage(dataStore.webpage.active.id, DeploymentEnvironment.PRODUCTION);
  deploying.value = false;
}
</script>
