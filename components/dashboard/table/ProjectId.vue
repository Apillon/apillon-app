<template>
  <n-data-table
    v-if="dataStore.currentProject"
    :bordered="false"
    :columns="columns"
    :data="[dataStore.currentProject]"
  />
</template>

<script lang="ts" setup>
const { t } = useI18n();
const dataStore = useDataStore();

// TODO: Project property: created
const createColumns = (): NDataTableColumns<ProjectInterface> => {
  return [
    {
      title: t('dashboard.value'),
      key: 'project_uuid',
    },
    {
      title: t('dashboard.created'),
      key: 'created',
      render(row) {
        return h('span', {}, { default: () => datetimeToDate('2022-12-13T07:21:50.000Z') });
      },
    },
  ];
};
const columns = createColumns();
</script>
